/**
 * 下载工具
 * 用于下载视频/图片并保存到相册
 */

import Taro from '@tarojs/taro'
import { DownloadResult, SaveResult, ProgressCallback } from '../services/watermark/types'

/**
 * 下载文件到临时目录
 * @param url 文件URL
 * @param onProgress 进度回调
 * @returns 下载结果
 */
export async function downloadFile(
  url: string,
  onProgress?: ProgressCallback
): Promise<DownloadResult> {
  return new Promise((resolve) => {
    const downloadTask = Taro.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve({
            success: true,
            tempFilePath: res.tempFilePath
          })
        } else {
          resolve({
            success: false,
            error: `下载失败，状态码: ${res.statusCode}`
          })
        }
      },
      fail: (err) => {
        resolve({
          success: false,
          error: err.errMsg || '下载失败'
        })
      }
    })

    // 监听下载进度
    if (onProgress) {
      downloadTask.onProgressUpdate((res) => {
        onProgress(res.progress)
      })
    }
  })
}

/**
 * 保存图片到相册
 * @param filePath 文件路径（可以是临时路径或网络URL）
 * @returns 保存结果
 */
export async function saveImageToAlbum(filePath: string): Promise<SaveResult> {
  try {
    // 如果是网络图片，先下载
    let tempPath = filePath
    if (filePath.startsWith('http')) {
      const downloadRes = await downloadFile(filePath)
      if (!downloadRes.success) {
        return { success: false, error: downloadRes.error }
      }
      tempPath = downloadRes.tempFilePath!
    }

    // 保存到相册
    await Taro.saveImageToPhotosAlbum({
      filePath: tempPath
    })

    return { success: true }
  } catch (err: any) {
    // 处理权限问题
    if (err.errMsg?.includes('auth deny') || err.errMsg?.includes('authorize')) {
      return {
        success: false,
        error: '请授权保存图片到相册'
      }
    }
    return {
      success: false,
      error: err.errMsg || '保存失败'
    }
  }
}

/**
 * 保存视频到相册
 * @param filePath 文件路径（可以是临时路径或网络URL）
 * @param onProgress 下载进度回调
 * @returns 保存结果
 */
export async function saveVideoToAlbum(
  filePath: string,
  onProgress?: ProgressCallback
): Promise<SaveResult> {
  try {
    // 如果是网络视频，先下载
    let tempPath = filePath
    if (filePath.startsWith('http')) {
      const downloadRes = await downloadFile(filePath, onProgress)
      if (!downloadRes.success) {
        return { success: false, error: downloadRes.error }
      }
      tempPath = downloadRes.tempFilePath!
    }

    // 保存到相册
    await Taro.saveVideoToPhotosAlbum({
      filePath: tempPath
    })

    return { success: true }
  } catch (err: any) {
    // 处理权限问题
    if (err.errMsg?.includes('auth deny') || err.errMsg?.includes('authorize')) {
      return {
        success: false,
        error: '请授权保存视频到相册'
      }
    }
    return {
      success: false,
      error: err.errMsg || '保存失败'
    }
  }
}

/**
 * 检查相册权限
 * @returns 是否有权限
 */
export async function checkAlbumPermission(): Promise<boolean> {
  try {
    const setting = await Taro.getSetting()
    return setting.authSetting['scope.writePhotosAlbum'] === true
  } catch {
    return false
  }
}

/**
 * 请求相册权限
 * @returns 是否授权成功
 */
export async function requestAlbumPermission(): Promise<boolean> {
  try {
    const res = await Taro.authorize({
      scope: 'scope.writePhotosAlbum'
    })
    return true
  } catch (err: any) {
    // 如果用户已经拒绝过，需要引导到设置页面
    if (err.errMsg?.includes('auth deny')) {
      const modalRes = await Taro.showModal({
        title: '需要相册权限',
        content: '请在设置中开启相册权限，以便保存图片/视频',
        confirmText: '去设置'
      })

      if (modalRes.confirm) {
        await Taro.openSetting()
        // 重新检查权限
        return checkAlbumPermission()
      }
    }
    return false
  }
}

/**
 * 批量保存图片到相册
 * @param urls 图片URL列表
 * @param onProgress 进度回调（0-100）
 * @returns 保存结果
 */
export async function saveImagesToAlbum(
  urls: string[],
  onProgress?: ProgressCallback
): Promise<SaveResult> {
  try {
    const total = urls.length
    let completed = 0

    for (const url of urls) {
      const result = await saveImageToAlbum(url)
      if (!result.success) {
        return result
      }
      completed++
      onProgress?.(Math.round((completed / total) * 100))
    }

    return { success: true }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || '保存失败'
    }
  }
}
