#!/usr/bin/env bash

# ============================================
# SSL 证书申请脚本
# ============================================

# ---------- 初始化 ----------
export LANG=en_US.UTF-8
set -e

# 全局变量
ACME_HOME="$HOME/.acme.sh"
CERT_TYPE="ecc" # 固定使用 ECC
CF_API_TOKEN=""
ALI_KEY=""
ALI_SECRET=""
DOMAIN=""
DNS_PROVIDER=""

# ---------- 工具函数 ----------
echoContent() {
    local color=$1
    local message=$2
    case $color in
        "red")
            printf "\033[31m%s\033[0m\n" "$message"
            ;;
        "green")
            printf "\033[32m%s\033[0m\n" "$message"
            ;;
        "yellow")
            printf "\033[33m%s\033[0m\n" "$message"
            ;;
        "skyBlue")
            printf "\033[1;36m%s\033[0m\n" "$message"
            ;;
        *)
            echo "$message"
            ;;
    esac
}

# 检查依赖
checkDep() {
    local cmd=$1
    if ! command -v "$cmd" &> /dev/null; then
        echoContent red "错误：未找到命令 $cmd，请先安装。"
        exit 1
    fi
}

# ---------- 主流程 ----------
main() {
    echoContent skyBlue "=========================================="
    echoContent skyBlue "  独立 SSL 证书申请脚本 (ECC版)"
    echoContent skyBlue "=========================================="
    echo ""

    # 检查依赖
    checkDep wget
    checkDep curl
    checkDep jq || echoContent yellow "警告：未安装 jq，部分解析功能可能受限。"

    # 1. 检查/安装 acme.sh
    installAcme

    # 2. 交互输入
    inputConfig

    # 3. 申请证书
    issueCertificate

    # 4. 询问是否创建自动续期任务
    askAutoRenew

    # 5. 结果提示
    echo ""
    echoContent skyBlue "=========================================="
    echoContent green "  全部任务完成！"
    echoContent yellow "  证书目录：${ACME_HOME}/${DOMAIN}_ecc"
    echoContent skyBlue "=========================================="
}

# 安装 acme.sh
installAcme() {
    echoContent skyBlue "---------- 1. 检查 acme.sh ----------"
    if [[ ! -f "$ACME_HOME/acme.sh" ]]; then
        echoContent yellow "正在安装 acme.sh..."
        curl -s https://get.acme.sh | sh >/dev/null 2>&1
        source "$HOME/.bashrc" >/dev/null 2>&1 || true
        echoContent green "acme.sh 安装成功"
    else
        echoContent green "acme.sh 已就绪"
    fi
}

# 交互配置
inputConfig() {
    echoContent skyBlue "---------- 2. 配置参数 ----------"
    read -p "请输入域名 (例如 example.com): " DOMAIN
    if [[ -z "$DOMAIN" ]]; then
        echoContent red "域名不能为空！"
        exit 1
    fi

    echoContent yellow "\n请选择验证方式："
    echoContent yellow "1) HTTP 验证 (需开放 80 端口)"
    echoContent yellow "2) DNS API 验证 (Cloudflare)"
    echoContent yellow "3) DNS API 验证 (Aliyun)"
    read -p "请选择 (1/2/3): " VALIDATION_TYPE

    case $VALIDATION_TYPE in
        2)
            DNS_PROVIDER="cloudflare"
            read -p "请输入 Cloudflare API Token: " CF_API_TOKEN
            if [[ -z "$CF_API_TOKEN" ]]; then exit 1; fi
            ;;
        3)
            DNS_PROVIDER="aliyun"
            read -p "请输入 Aliyun Access Key: " ALI_KEY
            read -p "请输入 Aliyun Access Secret: " ALI_SECRET
            if [[ -z "$ALI_KEY" || -z "$ALI_SECRET" ]]; then exit 1; fi
            ;;
        *)
            DNS_PROVIDER="standalone"
            echoContent yellow "使用 Standalone 模式，请确保 80 端口未被占用。"
            ;;
    esac
}

# 申请证书核心逻辑
issueCertificate() {
    echoContent skyBlue "---------- 3. 申请证书 ----------"

    cd "$HOME" || exit 1

    local ecc_flag="--keylength ec-256"
    local issue_command=("$ACME_HOME/acme.sh" --issue "$ecc_flag" --force)

    if [[ "$DNS_PROVIDER" == "cloudflare" ]]; then
        export CF_Token="$CF_API_TOKEN"
        issue_command+=(--dns dns_cf -d "$DOMAIN")
    elif [[ "$DNS_PROVIDER" == "aliyun" ]]; then
        export Ali_Key="$ALI_KEY"
        export Ali_Secret="$ALI_SECRET"
        issue_command+=(--dns dns_ali -d "$DOMAIN")
    else
        issue_command+=(--standalone -d "$DOMAIN")
    fi

    echoContent yellow "正在执行申请命令..."
    "${issue_command[@]}" || {
        echoContent red "证书申请失败，请检查域名或网络。"
        exit 1
    }

    local cert_dir_name="${DOMAIN}_ecc"
    local target_cert_dir="$HOME/.acme.sh/$cert_dir_name"

    if [[ ! -d "$target_cert_dir" ]]; then
        echoContent red "错误：证书目录未生成。"
        exit 1
    fi

    echoContent green "✅ 证书已生成在：$target_cert_dir"
}

# 询问是否创建自动续期任务
askAutoRenew() {
    echoContent skyBlue "---------- 4. 自动续期配置 ----------"
    echo ""
    echoContent yellow "证书有效期为 90 天，建议设置自动续期任务。"
    echoContent yellow "续期策略：当证书有效期小于30天时自动续期。"
    read -p "是否创建自动续期任务？(y/n，默认 y): " AUTO_RENEW
    AUTO_RENEW=${AUTO_RENEW:-y}

    if [[ "$AUTO_RENEW" == "y" || "$AUTO_RENEW" == "Y" ]]; then
        setupAutoRenew
    else
        echoContent yellow "已跳过自动续期任务配置"
        echoContent yellow "你可以稍后手动执行续期：acme.sh --cron"
    fi
}

# 配置自动续期任务
setupAutoRenew() {
    local renew_cmd="\"$ACME_HOME/acme.sh\" --cron --home \"$ACME_HOME\" --days 30 > /dev/null"

    if crontab -l 2>/dev/null | grep -q "acme.sh"; then
        echoContent yellow "检测到已存在 acme.sh 的定时任务："
        local existing_cron=$(crontab -l 2>/dev/null | grep "acme.sh" | head -1)
        echoContent yellow "  $existing_cron"
        read -p "是否替换为新的定时任务？(y/n，默认 y): " REPLACE_CRON
        REPLACE_CRON=${REPLACE_CRON:-y}

        if [[ "$REPLACE_CRON" == "y" || "$REPLACE_CRON" == "Y" ]]; then
            (crontab -l 2>/dev/null | grep -v "acme.sh" ; echo "0 0 * * * $renew_cmd") | crontab -
            echoContent green "已替换为新的定时任务"
        else
            echoContent yellow "保留现有 cron 任务，未做修改"
        fi
    else
        (crontab -l 2>/dev/null ; echo "0 0 * * * $renew_cmd") | crontab -
        echoContent green "已创建新的定时任务"
    fi

    echoContent yellow "当前 acme.sh 定时任务："
    crontab -l 2>/dev/null | grep "acme.sh" | while read -r line; do
        echoContent yellow "  $line"
    done

    echoContent green "✅ 自动续期任务配置完成！"
    echoContent yellow "  检查频率：每天凌晨 0 点"
    echoContent yellow "  证书有效期：90 天"
    echoContent yellow "  续期策略：当证书有效期小于30天时自动续期"
}

# 执行主函数
main "$@"