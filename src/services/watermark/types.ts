/**
 * 去水印服务类型定义
 */

// 支持的平台类型
export type PlatformType =
  | 'douyin'      // 抖音
  | 'kuaishou'    // 快手
  | 'xiaohongshu' // 小红书
  | 'weibo'       // 微博
  | 'pipixia'     // 皮皮虾
  | 'xigua'       // 西瓜视频
  | 'unknown'     // 未知平台

// 媒体类型
export type MediaType = 'video' | 'image' | 'images'

// 解析结果
export interface ParseResult {
  success: boolean
  platform: PlatformType
  mediaType: MediaType
  title: string
  author: string
  authorAvatar?: string
  videoUrl?: string        // 无水印视频地址
  imageUrls?: string[]     // 无水印图片地址列表
  coverUrl?: string        // 封面图地址
  duration?: number        // 视频时长（秒）
  width?: number           // 宽度
  height?: number          // 高度
  error?: string           // 错误信息
}

// 处理选项
export interface ProcessOptions {
  quality?: number         // 输出质量 0-100
  format?: 'jpg' | 'png'   // 输出格式
  cropArea?: CropArea      // 裁剪区域
}

// 裁剪区域
export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

// 处理结果
export interface ProcessResult {
  success: boolean
  originalPath: string     // 原图路径
  resultPath: string       // 处理后路径
  error?: string
}

// 去水印记录
export interface WatermarkRecord {
  id: string                          // 唯一ID
  type: 'url' | 'image' | 'video'     // 类型
  mediaType: MediaType                // 媒体类型
  sourceUrl?: string                  // 原始URL
  platform?: PlatformType             // 平台
  title?: string                      // 标题
  author?: string                     // 作者
  resultUrls: string[]                // 结果地址列表
  coverUrl?: string                   // 封面
  createdAt: number                   // 创建时间
  savedToAlbum: boolean               // 是否已保存到相册
}

// 下载进度回调
export type ProgressCallback = (progress: number) => void

// 下载结果
export interface DownloadResult {
  success: boolean
  tempFilePath?: string
  error?: string
}

// 保存结果
export interface SaveResult {
  success: boolean
  error?: string
}
