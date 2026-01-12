/**
 * 去水印服务入口
 * 统一导出所有去水印相关功能
 */

// 类型导出
export * from './types'

// 解析服务
export { parseVideoUrl, getSupportedPlatforms } from './parser'

// 工具函数
export { identifyPlatform, extractUrl, isSupportedPlatform, getPlatformName, isValidUrl } from '../../utils/platform'
export {
  downloadFile,
  saveImageToAlbum,
  saveVideoToAlbum,
  saveImagesToAlbum,
  checkAlbumPermission,
  requestAlbumPermission
} from '../../utils/download'
