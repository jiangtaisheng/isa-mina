/**
 * 去水印结果页
 * 展示解析/处理后的结果，提供保存和分享功能
 */

import { View, Text, Image, Video, ScrollView, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import {
  ParseResult,
  saveVideoToAlbum,
  saveImageToAlbum,
  saveImagesToAlbum,
  requestAlbumPermission,
  getPlatformName
} from '../../services/watermark'
import { addRecord } from '../../services/storage/records'
import './index.scss'

// 结果数据（通过页面参数传递）
interface ResultData extends ParseResult {
  sourceUrl?: string
}

export default function Result() {
  const router = useRouter()
  const [result, setResult] = useState<ResultData | null>(null)
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [saved, setSaved] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    // 从全局数据获取结果
    const app = Taro.getApp()
    const data = app.globalData?.parseResult as ResultData
    if (data) {
      setResult(data)
      // 保存到历史记录
      saveToHistory(data)
    } else {
      Taro.showToast({ title: '数据加载失败', icon: 'none' })
      setTimeout(() => Taro.navigateBack(), 1500)
    }
  }, [])

  // 保存到历史记录
  const saveToHistory = async (data: ResultData) => {
    try {
      await addRecord({
        type: 'url',
        mediaType: data.mediaType,
        sourceUrl: data.sourceUrl,
        platform: data.platform,
        title: data.title,
        author: data.author,
        resultUrls: data.mediaType === 'images'
          ? (data.imageUrls || [])
          : (data.videoUrl ? [data.videoUrl] : []),
        coverUrl: data.coverUrl,
        savedToAlbum: false
      })
    } catch (err) {
      console.error('保存历史记录失败:', err)
    }
  }

  // 保存到相册
  const handleSave = async () => {
    if (!result || saving) return

    // 请求权限
    const hasPermission = await requestAlbumPermission()
    if (!hasPermission) {
      Taro.showToast({ title: '请授权相册权限', icon: 'none' })
      return
    }

    setSaving(true)
    setProgress(0)

    try {
      let saveResult

      if (result.mediaType === 'video' && result.videoUrl) {
        // 保存视频
        saveResult = await saveVideoToAlbum(result.videoUrl, (p) => setProgress(p))
      } else if (result.mediaType === 'images' && result.imageUrls?.length) {
        // 保存多张图片
        saveResult = await saveImagesToAlbum(result.imageUrls, (p) => setProgress(p))
      } else if (result.mediaType === 'image' && result.imageUrls?.[0]) {
        // 保存单张图片
        saveResult = await saveImageToAlbum(result.imageUrls[0])
      } else {
        throw new Error('没有可保存的内容')
      }

      if (saveResult.success) {
        setSaved(true)
        Taro.showToast({ title: '保存成功', icon: 'success' })
      } else {
        throw new Error(saveResult.error)
      }
    } catch (err: any) {
      Taro.showToast({
        title: err.message || '保存失败',
        icon: 'none'
      })
    } finally {
      setSaving(false)
      setProgress(0)
    }
  }

  // 分享
  const handleShare = () => {
    // 小程序分享通过 onShareAppMessage 配置
    Taro.showShareMenu({
      withShareTicket: true
    })
  }

  // 切换图片
  const handleImageSwitch = (index: number) => {
    setCurrentImageIndex(index)
  }

  if (!result) {
    return (
      <View className='result-page loading'>
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className='result-page'>
      {/* 头部信息 */}
      <View className='header'>
        <View className='platform-tag'>
          <Text className='platform-name'>{getPlatformName(result.platform)}</Text>
        </View>
        <Text className='title'>{result.title || '无标题'}</Text>
        <Text className='author'>@{result.author || '未知作者'}</Text>
      </View>

      {/* 媒体预览区 */}
      <View className='media-section'>
        {result.mediaType === 'video' ? (
          // 视频预览
          <Video
            className='video-player'
            src={result.videoUrl || ''}
            poster={result.coverUrl}
            controls
            showFullscreenBtn
            showPlayBtn
            showCenterPlayBtn
            enableProgressGesture
          />
        ) : (
          // 图片预览
          <View className='image-preview'>
            <Image
              className='preview-image'
              src={result.imageUrls?.[currentImageIndex] || result.coverUrl || ''}
              mode='aspectFit'
              showMenuByLongpress
            />
            {/* 图片计数器 */}
            {result.imageUrls && result.imageUrls.length > 1 && (
              <View className='image-counter'>
                <Text>{currentImageIndex + 1} / {result.imageUrls.length}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* 多图片缩略图 */}
      {result.imageUrls && result.imageUrls.length > 1 && (
        <ScrollView className='thumbnail-list' scrollX>
          {result.imageUrls.map((url, index) => (
            <View
              key={index}
              className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleImageSwitch(index)}
            >
              <Image
                className='thumbnail-image'
                src={url}
                mode='aspectFill'
              />
            </View>
          ))}
        </ScrollView>
      )}

      {/* 视频时长 */}
      {result.mediaType === 'video' && result.duration && (
        <View className='info-bar'>
          <Text className='duration'>
            时长: {Math.floor(result.duration / 60)}:{(result.duration % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      )}

      {/* 保存进度 */}
      {saving && (
        <View className='progress-bar'>
          <View className='progress-inner' style={{ width: `${progress}%` }} />
          <Text className='progress-text'>{progress}%</Text>
        </View>
      )}

      {/* 操作按钮 */}
      <View className='action-bar'>
        <Button
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saving || saved}
        >
          {saving ? '保存中...' : saved ? '已保存' : '保存到相册'}
        </Button>
        <Button className='share-btn' openType='share'>
          分享
        </Button>
      </View>

      {/* 提示信息 */}
      <View className='tips'>
        <Text className='tip-text'>长按图片可直接保存</Text>
      </View>
    </View>
  )
}
