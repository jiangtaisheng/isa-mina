/**
 * URL输入组件
 * 用于输入和解析短视频平台链接
 */

import { View, Text, Input, Button } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

interface UrlInputProps {
  placeholder?: string
  onSubmit: (url: string) => void
  loading?: boolean
}

export default function UrlInput({
  placeholder = '请粘贴视频/图片链接',
  onSubmit,
  loading = false
}: UrlInputProps) {
  const [value, setValue] = useState('')

  // 输入变化
  const handleChange = (e: any) => {
    setValue(e.detail.value)
  }

  // 提交
  const handleSubmit = () => {
    const trimmedValue = value.trim()
    if (!trimmedValue) return
    onSubmit(trimmedValue)
  }

  // 清空
  const handleClear = () => {
    setValue('')
  }

  // 粘贴
  const handlePaste = async () => {
    try {
      // 小程序环境使用 getClipboardData
      const res = await wx.getClipboardData({})
      if (res.data) {
        setValue(res.data)
      }
    } catch (err) {
      console.error('粘贴失败:', err)
    }
  }

  return (
    <View className='url-input'>
      <View className='input-wrapper'>
        <Input
          className='input-field'
          type='text'
          value={value}
          placeholder={placeholder}
          placeholderClass='placeholder'
          onInput={handleChange}
          disabled={loading}
        />
        {value && !loading && (
          <View className='clear-btn' onClick={handleClear}>
            <Text>X</Text>
          </View>
        )}
      </View>

      <View className='action-row'>
        <Button className='paste-btn' onClick={handlePaste} disabled={loading}>
          粘贴
        </Button>
        <Button
          className='submit-btn'
          onClick={handleSubmit}
          disabled={!value.trim() || loading}
        >
          {loading ? '解析中...' : '解析'}
        </Button>
      </View>

      <View className='tips'>
        <Text className='tip-text'>
          支持抖音、快手、小红书、微博等平台链接
        </Text>
      </View>
    </View>
  )
}
