/**
 * mihomo 配置覆写脚本
 * 更新时间：2026-07-10
 */

// --- 节点过滤词 ---
const excludeFilter =
  /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|⚠️|@|Expire|http|com/u;


// ============================================================
// 地区节点组定义
// ============================================================

const regionDefinitions = [
  {
    name: '🇭🇰 香港节点',
    filter: '(🇭🇰|HK|港|HongKong|HONGKONG|深港|HKG|九龙|Kowloon|新界|沙田|荃湾|葵涌)',
  },
  {
    name: '🇺🇸 美国节点',
    filter: '(🇺🇸|US|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|纽约|纽纽|亚特兰大|迈阿密|华盛顿|UnitedStates|USA|America|JFK|EWR|IAD|ATL|ORD|MIA|NYC|LAX|SFO|SEA|DFW|SJC)',
  },
  {
    name: '🇯🇵 日本节点',
    filter: '(🇯🇵|JP|日本|川日|东京|大阪|泉日|埼玉|沪日|深日|Japan|JAPAN|JPN|NRT|HND|KIX|TYO|OSA|关西|Kansai)',
  },
  {
    name: '🇸🇬 新加坡节点',
    filter: '(🇸🇬|SG|新加坡|坡|狮城|Singapore|SINGAPORE|SIN)',
  },
  {
    name: '🇼🇸 台湾节点',
    filter: '(🇹🇼|🇼🇸|TW|台|新北|彰化|Taiwan|TAIWAN|TWN|TPE|ROC)',
  },
  {
    name: '🇰🇷 韩国节点',
    filter: '(🇰🇷|KR|Korea|KOREA|KOR|首尔|韩|韓|春川|Chuncheon|ICN)',
  },
];

// ============================================================
// Rule Providers 配置
// ============================================================

// 规则集 URL 锚点
const ruleProviderUrls = {
  geosite_base: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/',
  geoip_base: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/',
  custom_base: 'https://raw.githubusercontent.com/Dawneng/Rule/master/rules/Providers/',
};

// 规则集本地路径
const ruleProviderPaths = {
  geosite: './Providers/geosite/',
  geoip: './Providers/geoip/',
  custom: './Providers/custom/',
};

// 规则集模板工厂
function geositeDomain(name, filename) {
  return {
    type: 'http',
    behavior: 'domain',
    format: 'mrs',
    interval: 86400,
    path: `${ruleProviderPaths.geosite}${filename}.mrs`,
    url: `${ruleProviderUrls.geosite_base}${name}.mrs`,
  };
}

function geoipIpcidr(name, filename) {
  return {
    type: 'http',
    behavior: 'ipcidr',
    format: 'mrs',
    interval: 86400,
    path: `${ruleProviderPaths.geoip}${filename}.mrs`,
    url: `${ruleProviderUrls.geoip_base}${name}.mrs`,
  };
}

function customDomain(filename) {
  return {
    type: 'http',
    behavior: 'domain',
    format: 'mrs',
    interval: 86400,
    path: `${ruleProviderPaths.custom}${filename}.mrs`,
    url: `${ruleProviderUrls.custom_base}${filename}.mrs`,
  };
}

function customIpcidr(filename) {
  return {
    type: 'http',
    behavior: 'ipcidr',
    format: 'mrs',
    interval: 86400,
    path: `${ruleProviderPaths.custom}${filename}.mrs`,
    url: `${ruleProviderUrls.custom_base}${filename}.mrs`,
  };
}

// 全部规则集定义
const baseRuleProviders = {
  // 自定义规则集
  CustomDirect_Domain: customDomain('CustomDirect_Domain'),
  CustomProxy_Domain: customDomain('CustomProxy_Domain'),
  Steam_CDN_Domain: customDomain('Steam_CDN_Domain'),
  Steam_CDN_IP: customIpcidr('Steam_CDN_IP'),
  'fakeip-filter_Domain': customDomain('fakeip-filter_Domain'),

  // geoip 规则集
  geoip_cn: geoipIpcidr('cn', 'cn'),
  geoip_facebook: geoipIpcidr('facebook', 'facebook'),
  geoip_google: geoipIpcidr('google', 'google'),
  geoip_netflix: geoipIpcidr('netflix', 'netflix'),
  geoip_private: geoipIpcidr('private', 'private'),
  geoip_telegram: geoipIpcidr('telegram', 'telegram'),
  geoip_twitter: geoipIpcidr('twitter', 'twitter'),

  // geosite 规则集
  geosite_apple: geositeDomain('apple', 'apple'),
  geosite_bytedance: geositeDomain('bytedance', 'bytedance'),
  'geosite_apple@cn': geositeDomain('apple@cn', 'apple@cn'),
  'geosite_apple-tvplus': geositeDomain('apple-tvplus', 'apple-tvplus'),
  geosite_bahamut: geositeDomain('bahamut', 'bahamut'),
  'geosite_category-ai-!cn': geositeDomain('category-ai-!cn', 'category-ai-!cn'),
  'geosite_category-communication': geositeDomain('category-communication', 'category-communication'),
  'geosite_category-ecommerce': geositeDomain('category-ecommerce', 'category-ecommerce'),
  'geosite_category-emby': geositeDomain('category-emby', 'category-emby'),
  'geosite_category-entertainment': geositeDomain('category-entertainment', 'category-entertainment'),
  'geosite_category-game-platforms-download': geositeDomain('category-game-platforms-download', 'category-game-platforms-download'),
  'geosite_category-games': geositeDomain('category-games', 'category-games'),
  'geosite_category-games@cn': geositeDomain('category-games@cn', 'category-games@cn'),
  'geosite_category-public-tracker': geositeDomain('category-public-tracker', 'category-public-tracker'),
  'geosite_category-social-media-!cn': geositeDomain('category-social-media-!cn', 'category-social-media-!cn'),
  'geosite_category-speedtest': geositeDomain('category-speedtest', 'category-speedtest'),
  geosite_cn: geositeDomain('cn', 'cn'),
  geosite_disney: geositeDomain('disney', 'disney'),
  geosite_gfw: geositeDomain('gfw', 'gfw'),
  geosite_github: geositeDomain('github', 'github'),
  geosite_google: geositeDomain('google', 'google'),
  'geosite_google@cn': geositeDomain('google@cn', 'google-cn'),
  geosite_googlefcm: geositeDomain('googlefcm', 'googlefcm'),
  geosite_hbo: geositeDomain('hbo', 'hbo'),
  geosite_microsoft: geositeDomain('microsoft', 'microsoft'),
  geosite_netflix: geositeDomain('netflix', 'netflix'),
  geosite_openai: geositeDomain('openai', 'openai'),
  geosite_primevideo: geositeDomain('primevideo', 'primevideo'),
  geosite_private: geositeDomain('private', 'private'),
  geosite_spotify: geositeDomain('spotify', 'spotify'),
  geosite_steam: geositeDomain('steam', 'steam'),
  geosite_tiktok: geositeDomain('tiktok', 'tiktok'),
  geosite_youtube: geositeDomain('youtube', 'youtube'),
  'geosite_geolocation-!cn': geositeDomain('geolocation-!cn', 'geolocation-!cn'),
};

// ============================================================
// 分流规则定义
// ============================================================

const serviceConfigs = [
  {
    name: '🤖 ChatGPT',
    key: 'ChatGPT',
    rules: ['RULE-SET,geosite_openai,🤖 ChatGPT'],
  },
  {
    name: '🤖 AI服务',
    key: 'AIService',
    rules: ["RULE-SET,geosite_category-ai-!cn,🤖 AI服务"],
  },
  {
    name: '🎥 YouTube',
    key: 'YouTube',
    rules: ['RULE-SET,geosite_youtube,🎥 YouTube'],
  },
  {
    name: '🎬 Netflix',
    key: 'Netflix',
    rules: [
      'RULE-SET,geosite_netflix,🎬 Netflix',
      'RULE-SET,geoip_netflix,🎬 Netflix,no-resolve',
    ],
  },
  {
    name: '🎬 DisneyPlus',
    key: 'DisneyPlus',
    rules: ['RULE-SET,geosite_disney,🎬 DisneyPlus'],
  },
  {
    name: '🎬 HBO',
    key: 'HBO',
    rules: ['RULE-SET,geosite_hbo,🎬 HBO'],
  },
  {
    name: '🎬 PrimeVideo',
    key: 'PrimeVideo',
    rules: ['RULE-SET,geosite_primevideo,🎬 PrimeVideo'],
  },
  {
    name: '🎬 AppleTV+',
    key: 'AppleTVPlus',
    rules: ['RULE-SET,geosite_apple-tvplus,🎬 AppleTV+'],
  },
  {
    name: '🎬 Emby',
    key: 'Emby',
    rules: ['RULE-SET,geosite_category-emby,🎬 Emby'],
  },
  {
    name: '🎻 Spotify',
    key: 'Spotify',
    rules: ['RULE-SET,geosite_spotify,🎻 Spotify'],
  },
  {
    name: '📺 Bahamut',
    key: 'Bahamut',
    rules: ['RULE-SET,geosite_bahamut,📺 Bahamut'],
  },
  {
    name: '🎤 TikTok',
    key: 'TikTok',
    rules: ['RULE-SET,geosite_tiktok,🎤 TikTok'],
  },
  {
    name: '💬 即时通讯',
    key: 'Communication',
    rules: [
      'RULE-SET,geosite_category-communication,💬 即时通讯',
      'RULE-SET,geoip_telegram,💬 即时通讯,no-resolve',
    ],
  },
  {
    name: '🌐 社交媒体',
    key: 'SocialMedia',
    rules: [
      "RULE-SET,geosite_category-social-media-!cn,🌐 社交媒体",
      'RULE-SET,geoip_twitter,🌐 社交媒体,no-resolve',
      'RULE-SET,geoip_facebook,🌐 社交媒体,no-resolve',
    ],
  },
  {
    name: '🚀 GitHub',
    key: 'GitHub',
    rules: ['RULE-SET,geosite_github,🚀 GitHub'],
  },
  {
    name: '🚀 测速工具',
    key: 'SpeedTest',
    rules: ['RULE-SET,geosite_category-speedtest,🚀 测速工具'],
  },
  {
    name: '🎮 Steam',
    key: 'Steam',
    rules: [
      'RULE-SET,geosite_steam,🎮 Steam',
      'RULE-SET,Steam_CDN_Domain,🎮 Steam',
      'RULE-SET,Steam_CDN_IP,🎮 Steam,no-resolve',
    ],
  },
  {
    name: '📢 谷歌FCM',
    key: 'FCM',
    rules: ['RULE-SET,geosite_googlefcm,📢 谷歌FCM'],
  },
  {
    name: '🇬 谷歌服务',
    key: 'Google',
    rules: [
      'RULE-SET,geosite_google,🇬 谷歌服务',
      "RULE-SET,geosite_google@cn,🇬 谷歌服务",
      'RULE-SET,geoip_google,🇬 谷歌服务,no-resolve',
    ],
  },
  {
    name: '🍎 苹果服务',
    key: 'Apple',
    rules: ['RULE-SET,geosite_apple,🍎 苹果服务'],
  },
  {
    name: 'Ⓜ 微软服务',
    key: 'Microsoft',
    rules: ['RULE-SET,geosite_microsoft,Ⓜ 微软服务'],
  },
  {
    name: '🎮 游戏平台',
    key: 'Games',
    rules: ['RULE-SET,geosite_category-games,🎮 游戏平台'],
  },
  {
    name: '🛒 国外电商',
    key: 'Ecommerce',
    rules: ['RULE-SET,geosite_category-ecommerce,🛒 国外电商'],
  },
  {
    name: '🌎 国外媒体',
    key: 'Entertainment',
    rules: ['RULE-SET,geosite_category-entertainment,🌎 国外媒体'],
  },
];

// 节点过滤方法
function filterProxies(proxies, filter) {
  return proxies.filter((p) => !filter.test(p.name));
}

// ============================================================
// 主入口
// ============================================================

function main(config) {
  const newConfig = {};

  // --- 全局配置 ---
  newConfig['port'] = 7890;
  newConfig['socks-port'] = 7891;
  newConfig['redir-port'] = 7892;
  newConfig['mixed-port'] = 7893;
  newConfig['tproxy-port'] = 7894;
  newConfig['allow-lan'] = true;
  newConfig['mode'] = 'rule';
  newConfig['bind-address'] = '*';
  newConfig['ipv6'] = false;
  newConfig['unified-delay'] = true;
  newConfig['tcp-concurrent'] = true;
  newConfig['log-level'] = 'warning';
  newConfig['keep-alive-idle'] = 600;
  newConfig['keep-alive-interval'] = 15;
  newConfig['profile'] = {
    'store-selected': true,
    'store-fake-ip': true,
  };

  // --- GEO 数据配置 ---
  newConfig['geodata-mode'] = true;
  newConfig['geodata-loader'] = 'standard';
  newConfig['geo-auto-update'] = true;
  newConfig['geo-update-interval'] = 24;
  newConfig['geox-url'] = {
    geoip: 'https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat',
    geosite: 'https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat',
    mmdb: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country.mmdb',
    asn: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb',
  };
  newConfig['global-ua'] = 'clash.meta';
  newConfig['etag-support'] = true;

  // --- 外部控制 ---
  newConfig['external-controller'] = '0.0.0.0:9090';
  newConfig['secret'] = 'yDCOAkkD';
  newConfig['external-ui'] = 'ui';
  newConfig['external-ui-name'] = 'zashboard';
  newConfig['external-ui-url'] = 'https://codeload.github.com/Zephyruso/zashboard/zip/refs/heads/gh-pages-cdn-fonts';
  newConfig['find-process-mode'] = 'strict';

  // --- 嗅探配置 ---
  newConfig['sniffer'] = {
    enable: true,
    'override-destination': true,
    sniff: {
      QUIC: { ports: [443, 8443] },
      TLS: { ports: [443, 8443] },
      HTTP: { ports: [80, '8080-8880'], 'override-destination': true },
    },
    'force-domain': ['+.netflix.com', '+.nflxvideo.net', '+.amazonaws.com', '+.media.dssott.com'],
    'skip-domain': ['Mijia Cloud', 'dlg.io.mi.com', '+.oray.com', '+.sunlogin.net', '+.push.apple.com'],
    'parse-pure-ip': true,
  };

  // --- NTP ---
  newConfig['ntp'] = {
    enable: true,
    'write-to-system': true,
    server: 'ntp.aliyun.com',
    port: 123,
    interval: 30,
  };

  // --- TUN ---
  newConfig['tun'] = {
    enable: true,
    stack: 'mixed',
    device: 'mihomo',
    'dns-hijack': ['any:53', 'tcp://any:53'],
    'auto-route': false,
    'auto-redirect': false,
    'auto-detect-interface': false,
  };

  // --- DNS 锚点 ---
  const cnDnsIp = ['223.5.5.5', '119.29.29.29'];
  const cnDns = [
    '223.5.5.5',
    '119.29.29.29',
    'https://223.5.5.5/dns-query',
    'https://doh.pub/dns-query',
  ];
  const foreignDns = [
    '8.8.4.4',
    '1.1.1.1',
    'https://dns.google/dns-query',
    'https://dns.cloudflare.com/dns-query',
  ];
  const msDns = [
    '4.2.2.1',
    '1.1.1.1',
    'https://dns.google/dns-query',
    'https://dns.cloudflare.com/dns-query',
  ];

  // --- DNS 配置 ---
  newConfig['dns'] = {
    enable: true,
    ipv6: false,
    'cache-algorithm': 'arc',
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/16',
    listen: '0.0.0.0:7874',
    'respect-rules': false,
    'fake-ip-filter-mode': 'blacklist',
    'default-nameserver': cnDnsIp,
    nameserver: cnDns,
    'nameserver-policy': {
      'rule-set:geosite_category-games@cn': cnDns,
      'rule-set:geosite_cn': cnDns,
      'rule-set:geosite_google': foreignDns,
      'rule-set:geosite_google@cn': foreignDns,
      'rule-set:geosite_github': foreignDns,
      'rule-set:geosite_microsoft': msDns,
      'rule-set:geosite_gfw': foreignDns,
      'rule-set:geosite_geolocation-!cn': foreignDns,
    },
    'fake-ip-filter': [
      'rule-set:geosite_category-games',
      'rule-set:geosite_apple@cn',
      'rule-set:geosite_google@cn',
      'rule-set:geosite_cn',
      'rule-set:fakeip-filter_Domain',
    ],
    'proxy-server-nameserver': cnDnsIp,
    fallback: foreignDns,
    'fallback-filter': {
      geoip: true,
      'geoip-code': 'CN',
      geosite: ['gfw'],
      ipcidr: [
        '::/128', '::1/128', '2001::/32',
        '0.0.0.0/8', '10.0.0.0/8', '100.64.0.0/10', '127.0.0.0/8',
        '169.254.0.0/16', '172.16.0.0/12', '192.0.0.0/24', '192.0.2.0/24',
        '192.88.99.0/24', '192.168.0.0/16', '198.18.0.0/15', '198.51.100.0/24',
        '203.0.113.0/24', '224.0.0.0/4', '240.0.0.0/4', '255.255.255.255/32',
      ],
      domain: [
        '+.google.com', '+.facebook.com', '+.youtube.com',
        '+.githubusercontent.com', '+.googlevideo.com',
        '+.msftconnecttest.com', '+.msftncsi.com',
      ],
    },
  };

  // 获取节点列表并过滤
  const proxies = filterProxies(config.proxies || [], excludeFilter);

  // 验证节点列表是否存在代理节点
  const isAllDirectOrReject = proxies.every((p) => {
    const type = p.type?.toLowerCase();
    return type === 'direct' || type === 'reject';
  });

  if (!proxies.length || isAllDirectOrReject) {
    throw new Error('配置文件中未找到任何代理节点，请使用机场提供的配置文件进行覆写');
  }

  // --- 构建地区组 ---

  // 节点分类
  const regionGroups = Object.fromEntries(regionDefinitions.map((r) => [r.name, { ...r, regex: new RegExp(r.filter), proxies: [] }]));
  const otherProxies = [];

  for (const proxy of proxies) {
    let matched = false;

    for (const region of Object.values(regionGroups)) {
      if (region.regex.test(proxy.name)) {
        regionGroups[region.name].proxies.push(proxy.name);
        matched = true;
      }
    }

    // 未匹配到地区组的归为其他节点
    if (!matched) {
      otherProxies.push(proxy.name);
    }
  }

  // --- 节点写入输出 ---
  newConfig['proxies'] = proxies;

  // --- 策略组构建 ---
  const urlTestConfig = {
    type: 'url-test',
    url: 'https://cp.cloudflare.com/generate_204',
    interval: 300,
    tolerance: 50,
  };

  const proxyGroups = [];

  // 🚀 手动选择
  proxyGroups.push({
    name: '🚀 手动选择',
    type: 'select',
    'include-all': true,
    filter: '.*',
    proxies: [
      '♻️ 自动选择',
      ...regionDefinitions.map((r) => r.name),
    ],
  });

  // ♻️ 自动选择
  proxyGroups.push({
    name: '♻️ 自动选择',
    ...urlTestConfig,
    'include-all': true,
    filter: '.*',
  });

  // 构建分流策略组
  const serviceProxies = [
    '🚀 手动选择',
    '♻️ 自动选择',
    ...regionDefinitions.map((r) => r.name),
  ];

  const serviceProxiesWithDirect = [
    ...serviceProxies,
    '🎯 全球直连',
  ];

  // 需要直连选项的策略组
  const directGroups = ['Emby', 'Spotify', 'Bahamut', 'AppleTVPlus', 'Apple', 'Microsoft', 'Steam', 'Games', 'SpeedTest'];

  for (const svc of serviceConfigs) {
    const useDirect = directGroups.includes(svc.key);
    proxyGroups.push({
      name: svc.name,
      type: 'select',
      filter: '.*',
      proxies: useDirect ? serviceProxiesWithDirect : serviceProxies,
    });
  }

  // 🐟 漏网之鱼
  proxyGroups.push({
    name: '🐟 漏网之鱼',
    type: 'select',
    filter: '.*',
    proxies: [
      '🚀 手动选择',
      '♻️ 自动选择',
      '🎯 全球直连',
      ...regionDefinitions.map((r) => r.name),
    ],
  });

  // 构建地区节点组
  for (const region of regionDefinitions) {
    proxyGroups.push({
      name: region.name,
      ...urlTestConfig,
      'include-all': true,
      filter: region.filter,
    });
  }

  // 🎯 全球直连
  proxyGroups.push({
    name: '🎯 全球直连',
    type: 'select',
    proxies: ['DIRECT'],
  });

  newConfig['proxy-groups'] = proxyGroups;

  // --- 规则集 ---
  newConfig['rule-providers'] = { ...baseRuleProviders };

  // --- 规则 ---
  const rules = [
    'RULE-SET,geosite_private,🎯 全球直连',
    'RULE-SET,geoip_private,🎯 全球直连,no-resolve',
    'RULE-SET,CustomDirect_Domain,🎯 全球直连',
    'RULE-SET,CustomProxy_Domain,🚀 手动选择',
    "RULE-SET,geosite_google@cn,🇬 谷歌服务",
    'RULE-SET,geosite_category-games@cn,🎯 全球直连',
    'RULE-SET,Steam_CDN_IP,🎯 全球直连,no-resolve',
    'RULE-SET,Steam_CDN_Domain,🎯 全球直连',
    'RULE-SET,geosite_category-game-platforms-download,🎯 全球直连',
    'RULE-SET,geosite_category-public-tracker,🎯 全球直连',
  ];

  // 动态添加分流规则
  for (const svc of serviceConfigs) {
    rules.push(...svc.rules);
  }

  // 兜底规则
  rules.push(
    'RULE-SET,geosite_gfw,🚀 手动选择',
    'RULE-SET,geosite_cn,🎯 全球直连',
    'RULE-SET,geoip_cn,🎯 全球直连,no-resolve',
    'RULE-SET,geosite_bytedance,🎯 全球直连',
    'PROCESS-NAME,aria2c,DIRECT',
    'PROCESS-NAME,BitComet,DIRECT',
    'PROCESS-NAME,fdm,DIRECT',
    'PROCESS-NAME,NetTransport,DIRECT',
    'PROCESS-NAME,qbittorrent,DIRECT',
    'PROCESS-NAME,Thunder,DIRECT',
    'PROCESS-NAME,transmission-daemon,DIRECT',
    'PROCESS-NAME,transmission-qt,DIRECT',
    'PROCESS-NAME,uTorrent,DIRECT',
    'PROCESS-NAME,WebTorrent,DIRECT',
    'PROCESS-NAME,Folx,DIRECT',
    'PROCESS-NAME,Transmission,DIRECT',
    'PROCESS-NAME,WebTorrent Helper,DIRECT',
    'PROCESS-NAME,v2ray,DIRECT',
    'PROCESS-NAME,ss-local,DIRECT',
    'PROCESS-NAME,ssr-local,DIRECT',
    'PROCESS-NAME,ss-redir,DIRECT',
    'PROCESS-NAME,ssr-redir,DIRECT',
    'PROCESS-NAME,ss-server,DIRECT',
    'PROCESS-NAME,trojan-go,DIRECT',
    'PROCESS-NAME,xray,DIRECT',
    'PROCESS-NAME,hysteria,DIRECT',
    'PROCESS-NAME,singbox,DIRECT',
    'PROCESS-NAME,UUBooster,DIRECT',
    'PROCESS-NAME,uugamebooster,DIRECT',
    'MATCH,🐟 漏网之鱼',
  );

  newConfig['rules'] = rules;

  // --- experimental ---
  newConfig['experimental'] = {
    'quic-go-disable-gso': true,
  };

  return newConfig;
}