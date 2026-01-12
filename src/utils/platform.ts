/**
 * 平台识别工具
 * 用于识别短视频平台链接类型
 */

import { PlatformType } from '../services/watermark/types'

// 平台域名匹配规则
const PLATFORM_PATTERNS: Record<PlatformType, RegExp[]> = {
  douyin: [
    /v\.douyin\.com/i,
    /www\.douyin\.com/i,
    /www\.iesdouyin\.com/i
  ],
  kuaishou: [
    /v\.kuaishou\.com/i,
    /www\.kuaishou\.com/i,
    /v\.kwai\.com/i
  ],
  xiaohongshu: [
    /xhslink\.com/i,
    /www\.xiaohongshu\.com/i,
    /xiaohongshu\.com/i
  ],
  weibo: [
    /weibo\.com/i,
    /weibo\.cn/i,
    /m\.weibo\.cn/i
  ],
  pipixia: [
    /h5\.pipix\.com/i,
    /www\.pipix\.com/i
  ],
  xigua: [
    /www\.ixigua\.com/i,
    /m\.ixigua\.com/i
  ],
  unknown: []
}

// 平台名称映射
export const PLATFORM_NAMES: Record<PlatformType, string> = {
  douyin: '抖音',
  kuaishou: '快手',
  xiaohongshu: '小红书',
  weibo: '微博',
  pipixia: '皮皮虾',
  xigua: '西瓜视频',
  unknown: '未知平台'
}

/**
 * 识别URL所属平台
 * @param url 输入的URL
 * @returns 平台类型
 */
export function identifyPlatform(url: string): PlatformType {
  if (!url) return 'unknown'

  const normalizedUrl = url.toLowerCase().trim()

  for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
    if (platform === 'unknown') continue

    for (const pattern of patterns) {
      if (pattern.test(normalizedUrl)) {
        return platform as PlatformType
      }
    }
  }

  return 'unknown'
}

/**
 * 提取URL中的链接
 * 用于处理分享文案中的链接
 * @param text 包含链接的文本
 * @returns 提取到的第一个URL
 */
export function extractUrl(text: string): string | null {
  if (!text) return null

  // URL正则表达式
  const urlPattern = /https?:\/\/[^\s\u4e00-\u9fa5]+/gi
  const matches = text.match(urlPattern)

  return matches?.[0] || null
}

/**
 * 检查URL是否是支持的平台
 * @param url 输入的URL
 * @returns 是否支持
 */
export function isSupportedPlatform(url: string): boolean {
  return identifyPlatform(url) !== 'unknown'
}

/**
 * 获取平台名称
 * @param platform 平台类型
 * @returns 平台中文名称
 */
export function getPlatformName(platform: PlatformType): string {
  return PLATFORM_NAMES[platform] || '未知平台'
}

/**
 * 验证URL格式
 * @param url 输入的URL
 * @returns 是否是有效URL
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false

  try {
    const urlPattern = /^https?:\/\/.+/i
    return urlPattern.test(url.trim())
  } catch {
    return false
  }
}
