/**
 * URL 解析服务
 * 用于解析短视频平台链接，获取无水印资源
 */

import Taro from '@tarojs/taro'
import { ParseResult, PlatformType, MediaType } from './types'
import { identifyPlatform, extractUrl } from '../../utils/platform'

// 解析API配置（需要配置自己的服务端地址）
const API_BASE_URL = 'https://api.example.com'  // TODO: 替换为实际的API地址

// 是否使用模拟数据（开发环境）
const USE_MOCK = true

/**
 * 解析短视频平台URL
 * @param inputUrl 用户输入的URL或分享文本
 * @returns 解析结果
 */
export async function parseVideoUrl(inputUrl: string): Promise<ParseResult> {
  try {
    // 提取URL（处理分享文案）
    const url = extractUrl(inputUrl) || inputUrl.trim()

    if (!url) {
      return {
        success: false,
        platform: 'unknown',
        mediaType: 'video',
        title: '',
        author: '',
        error: '请输入有效的链接'
      }
    }

    // 识别平台
    const platform = identifyPlatform(url)

    if (platform === 'unknown') {
      return {
        success: false,
        platform: 'unknown',
        mediaType: 'video',
        title: '',
        author: '',
        error: '暂不支持该平台，请输入抖音、快手、小红书等平台链接'
      }
    }

    // 开发环境使用模拟数据
    if (USE_MOCK) {
      return mockParseResult(platform, url)
    }

    // 调用解析API
    return await callParseApi(url, platform)
  } catch (err: any) {
    return {
      success: false,
      platform: 'unknown',
      mediaType: 'video',
      title: '',
      author: '',
      error: err.message || '解析失败，请稍后重试'
    }
  }
}

/**
 * 调用解析API
 * @param url 视频URL
 * @param platform 平台类型
 * @returns 解析结果
 */
async function callParseApi(url: string, platform: PlatformType): Promise<ParseResult> {
  try {
    const res = await Taro.request({
      url: `${API_BASE_URL}/api/parse`,
      method: 'POST',
      data: { url, platform },
      header: {
        'Content-Type': 'application/json'
      }
    })

    if (res.statusCode === 200 && res.data.success) {
      return {
        success: true,
        platform: res.data.platform || platform,
        mediaType: res.data.mediaType || 'video',
        title: res.data.title || '未知标题',
        author: res.data.author || '未知作者',
        authorAvatar: res.data.authorAvatar,
        videoUrl: res.data.videoUrl,
        imageUrls: res.data.imageUrls,
        coverUrl: res.data.coverUrl,
        duration: res.data.duration,
        width: res.data.width,
        height: res.data.height
      }
    } else {
      return {
        success: false,
        platform,
        mediaType: 'video',
        title: '',
        author: '',
        error: res.data?.message || '解析失败'
      }
    }
  } catch (err: any) {
    return {
      success: false,
      platform,
      mediaType: 'video',
      title: '',
      author: '',
      error: '网络请求失败，请检查网络连接'
    }
  }
}

/**
 * 模拟解析结果（开发环境使用）
 * @param platform 平台类型
 * @param url 原始URL
 * @returns 模拟的解析结果
 */
function mockParseResult(platform: PlatformType, url: string): ParseResult {
  // 模拟网络延迟
  const mockData: Record<PlatformType, () => ParseResult> = {
    douyin: () => ({
      success: true,
      platform: 'douyin',
      mediaType: 'video',
      title: '这是一个抖音视频示例标题 #热门 #推荐',
      author: '抖音创作者',
      authorAvatar: 'https://p3.douyinpic.com/aweme/100x100/aweme-avatar/default.jpeg',
      videoUrl: 'https://v.douyin.com/demo-video.mp4',
      coverUrl: 'https://p3.douyinpic.com/img/demo-cover.jpeg',
      duration: 15
    }),
    kuaishou: () => ({
      success: true,
      platform: 'kuaishou',
      mediaType: 'video',
      title: '快手短视频示例',
      author: '快手用户',
      videoUrl: 'https://v.kuaishou.com/demo-video.mp4',
      coverUrl: 'https://tx2.a.kwimgs.com/demo-cover.jpeg',
      duration: 30
    }),
    xiaohongshu: () => ({
      success: true,
      platform: 'xiaohongshu',
      mediaType: 'images',
      title: '小红书笔记分享 | 超实用的生活技巧',
      author: '小红书博主',
      imageUrls: [
        'https://sns-img.xiaohongshu.com/demo1.jpg',
        'https://sns-img.xiaohongshu.com/demo2.jpg',
        'https://sns-img.xiaohongshu.com/demo3.jpg'
      ],
      coverUrl: 'https://sns-img.xiaohongshu.com/demo-cover.jpg'
    }),
    weibo: () => ({
      success: true,
      platform: 'weibo',
      mediaType: 'video',
      title: '微博视频分享',
      author: '微博用户',
      videoUrl: 'https://f.video.weibocdn.com/demo-video.mp4',
      coverUrl: 'https://wx4.sinaimg.cn/demo-cover.jpg',
      duration: 60
    }),
    pipixia: () => ({
      success: true,
      platform: 'pipixia',
      mediaType: 'video',
      title: '皮皮虾搞笑视频',
      author: '皮皮虾用户',
      videoUrl: 'https://v.pipix.com/demo-video.mp4',
      coverUrl: 'https://p3.pstatp.com/demo-cover.jpg',
      duration: 20
    }),
    xigua: () => ({
      success: true,
      platform: 'xigua',
      mediaType: 'video',
      title: '西瓜视频精选',
      author: '西瓜创作者',
      videoUrl: 'https://v.ixigua.com/demo-video.mp4',
      coverUrl: 'https://p3.pstatp.com/demo-cover.jpg',
      duration: 180
    }),
    unknown: () => ({
      success: false,
      platform: 'unknown',
      mediaType: 'video',
      title: '',
      author: '',
      error: '不支持的平台'
    })
  }

  return mockData[platform]?.() || mockData.unknown()
}

/**
 * 获取支持的平台列表
 * @returns 支持的平台信息
 */
export function getSupportedPlatforms(): Array<{ platform: PlatformType; name: string; domains: string[] }> {
  return [
    { platform: 'douyin', name: '抖音', domains: ['v.douyin.com', 'www.douyin.com'] },
    { platform: 'kuaishou', name: '快手', domains: ['v.kuaishou.com'] },
    { platform: 'xiaohongshu', name: '小红书', domains: ['xhslink.com', 'xiaohongshu.com'] },
    { platform: 'weibo', name: '微博', domains: ['weibo.com', 'weibo.cn'] },
    { platform: 'pipixia', name: '皮皮虾', domains: ['h5.pipix.com'] },
    { platform: 'xigua', name: '西瓜视频', domains: ['www.ixigua.com'] }
  ]
}
