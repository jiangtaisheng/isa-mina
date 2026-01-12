/**
 * 结果卡片组件
 * 用于展示去水印结果的小卡片
 */

import { View, Text, Image } from '@tarojs/components'
import { ParseResult, getPlatformName } from '../../services/watermark'
import './index.scss'

interface ResultCardProps {
  result: ParseResult
  onClick?: () => void
}

export default function ResultCard({ result, onClick }: ResultCardProps) {
  // 获取封面图
  const getCoverUrl = () => {
    if (result.coverUrl) return result.coverUrl
    if (result.imageUrls?.length) return result.imageUrls[0]
    return ''
  }

  // 获取媒体类型标签
  const getMediaTypeLabel = () => {
    switch (result.mediaType) {
      case 'video':
        return '视频'
      case 'images':
        return `图集(${result.imageUrls?.length || 0})`
      case 'image':
        return '图片'
      default:
        return '未知'
    }
  }

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <View className='result-card' onClick={onClick}>
      {/* 封面 */}
      <View className='cover-section'>
        <Image
          className='cover-image'
          src={getCoverUrl()}
          mode='aspectFill'
        />

        {/* 媒体类型标签 */}
        <View className='type-tag'>
          <Text>{getMediaTypeLabel()}</Text>
        </View>

        {/* 视频时长 */}
        {result.mediaType === 'video' && result.duration && (
          <View className='duration-tag'>
            <Text>{formatDuration(result.duration)}</Text>
          </View>
        )}

        {/* 播放按钮 */}
        {result.mediaType === 'video' && (
          <View className='play-icon'>
            <View className='play-triangle' />
          </View>
        )}
      </View>

      {/* 信息区域 */}
      <View className='info-section'>
        {/* 平台标签 */}
        <View className='platform-tag'>
          <Text>{getPlatformName(result.platform)}</Text>
        </View>

        {/* 标题 */}
        <Text className='title' numberOfLines={2}>
          {result.title || '无标题'}
        </Text>

        {/* 作者 */}
        <View className='author-row'>
          {result.authorAvatar && (
            <Image
              className='author-avatar'
              src={result.authorAvatar}
              mode='aspectFill'
            />
          )}
          <Text className='author-name'>@{result.author || '未知'}</Text>
        </View>
      </View>

      {/* 箭头 */}
      <View className='arrow'>
        <Text>&gt;</Text>
      </View>
    </View>
  )
}
