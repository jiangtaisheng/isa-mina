/**
 * 处理中弹窗组件
 * 显示去水印处理进度
 */

import { View, Text } from '@tarojs/components'
import './index.scss'

interface ProcessingModalProps {
  visible: boolean
  title?: string
  message?: string
  progress?: number // 0-100
}

export default function ProcessingModal({
  visible,
  title = '处理中',
  message = '正在解析链接...',
  progress
}: ProcessingModalProps) {
  if (!visible) return null

  return (
    <View className='processing-modal'>
      <View className='modal-mask' />
      <View className='modal-content'>
        {/* 动画加载器 */}
        <View className='loader'>
          <View className='spinner' />
        </View>

        {/* 标题 */}
        <Text className='title'>{title}</Text>

        {/* 消息 */}
        <Text className='message'>{message}</Text>

        {/* 进度条 */}
        {typeof progress === 'number' && (
          <View className='progress-wrapper'>
            <View className='progress-bar'>
              <View
                className='progress-inner'
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className='progress-text'>{progress}%</Text>
          </View>
        )}
      </View>
    </View>
  )
}
