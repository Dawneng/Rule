#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将Clash/ClashMeta Provider YAML规则文件转换为list格式
支持的转换：
  - *keyword* → DOMAIN-KEYWORD,keyword
  - +.domain  → DOMAIN-SUFFIX,domain
  - 其他格式保持原样（DOMAIN-SUFFIX）

用法：
  python yaml_to_list.py <input.yaml> [output.list]

如果不指定输出文件，将自动生成同名的.list文件
"""

import yaml
import sys
import os
from pathlib import Path


def convert_yaml_to_list(yaml_path: str, list_path: str = None) -> tuple:
    """
    转换YAML规则文件为list格式

    Args:
        yaml_path: 输入的YAML文件路径
        list_path: 输出的list文件路径（可选）

    Returns:
        tuple: (规则总数, 输出文件路径)
    """
    # 读取YAML文件
    with open(yaml_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    payload = data.get('payload', [])

    # 如果未指定输出路径，自动生成
    if list_path is None:
        list_path = str(Path(yaml_path).with_suffix('.list'))

    # 转换规则
    lines = []
    lines.append(f'# Generated from {os.path.basename(yaml_path)}')
    lines.append(f'# Converted by yaml_to_list.py')
    lines.append(f'# TOTAL: {len(payload)}')
    lines.append('')

    keyword_count = 0
    suffix_count = 0

    for item in payload:
        if item.startswith('*') and item.endswith('*'):
            # *keyword* 格式 -> DOMAIN-KEYWORD
            keyword = item[1:-1]
            lines.append(f'DOMAIN-KEYWORD,{keyword}')
            keyword_count += 1
        elif item.startswith('+.'):
            # +.domain 格式 -> DOMAIN-SUFFIX
            domain = item[2:]
            lines.append(f'DOMAIN-SUFFIX,{domain}')
            suffix_count += 1
        else:
            # 其他格式 -> DOMAIN-SUFFIX
            lines.append(f'DOMAIN-SUFFIX,{item}')
            suffix_count += 1

    # 写入文件
    with open(list_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')

    return len(payload), keyword_count, suffix_count, list_path


def main():
    if len(sys.argv) < 2:
        print("用法: python yaml_to_list.py <input.yaml> [output.list]")
        print("示例: python yaml_to_list.py rules/Providers/Custom_Direct_Domain.yaml")
        sys.exit(1)

    yaml_path = sys.argv[1]
    list_path = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.exists(yaml_path):
        print(f"错误: 文件不存在 - {yaml_path}")
        sys.exit(1)

    total, keywords, suffixes, output_path = convert_yaml_to_list(yaml_path, list_path)

    print(f"转换完成!")
    print(f"  输入文件: {yaml_path}")
    print(f"  输出文件: {output_path}")
    print(f"  总规则数: {total}")
    print(f"  DOMAIN-KEYWORD: {keywords} 条")
    print(f"  DOMAIN-SUFFIX: {suffixes} 条")


if __name__ == '__main__':
    main()