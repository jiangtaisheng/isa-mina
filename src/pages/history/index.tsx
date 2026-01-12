/**
 * 历史记录页
 * 展示用户的去水印历史记录
 */

import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { WatermarkRecord, getPlatformName } from '../../services/watermark'
import { getRecords, deleteRecord, clearRecords } from '../../services/storage/records'
import './index.scss'

export default function History() {
  const [records, setRecords] = useState<WatermarkRecord[]>([])
  const [loading, setLoading] = useState(true)

  // 加载记录
  const loadRecords = async () => {
    setLoading(true)
    try {
      const data = await getRecords()
      setRecords(data)
    } catch (err) {
      console.error('加载历史记录失败:', err)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [])

  // 页面显示时刷新
  Taro.useDidShow(() => {
    loadRecords()
  })

  // 查看详情
  const handleViewDetail = (record: WatermarkRecord) => {
    // 将记录转换为 ParseResult 格式
    const app = Taro.getApp()
    app.globalData = app.globalData || {}
    app.globalData.parseResult = {
      success: true,
      platform: record.platform,
      mediaType: record.mediaType,
      title: record.title,
      author: record.author,
      videoUrl: record.mediaType === 'video' ? record.resultUrls[0] : undefined,
      imageUrls: record.mediaType !== 'video' ? record.resultUrls : undefined,
      coverUrl: record.coverUrl,
      sourceUrl: record.sourceUrl
    }

    Taro.navigateTo({
      url: '/pages/result/index'
    })
  }

  // 删除记录
  const handleDelete = async (record: WatermarkRecord, e: any) => {
    e.stopPropagation()

    const res = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmColor: '#ff4d4f'
    })

    if (res.confirm) {
      const success = await deleteRecord(record.id)
      if (success) {
        setRecords((prev) => prev.filter((r) => r.id !== record.id))
        Taro.showToast({ title: '已删除', icon: 'success' })
      } else {
        Taro.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  }

  // 清空全部
  const handleClearAll = async () => {
    if (records.length === 0) return

    const res = await Taro.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？此操作不可恢复。',
      confirmColor: '#ff4d4f'
    })

    if (res.confirm) {
      const success = await clearRecords()
      if (success) {
        setRecords([])
        Taro.showToast({ title: '已清空', icon: 'success' })
      } else {
        Taro.showToast({ title: '清空失败', icon: 'none' })
      }
    }
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - timestamp

    // 一天内显示相对时间
    if (diff < 24 * 60 * 60 * 1000) {
      if (diff < 60 * 1000) return '刚刚'
      if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}分钟前`
      return `${Math.floor(diff / 3600000)}小时前`
    }

    // 超过一天显示日期
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')

    if (year === now.getFullYear()) {
      return `${month}-${day} ${hour}:${minute}`
    }
    return `${year}-${month}-${day}`
  }

  // 获取媒体类型标签
  const getMediaTypeLabel = (mediaType: string) => {
    switch (mediaType) {
      case 'video':
        return '视频'
      case 'images':
        return '图集'
      case 'image':
        return '图片'
      default:
        return '未知'
    }
  }

  return (
    <View className='history-page'>
      {/* 头部操作栏 */}
      {records.length > 0 && (
        <View className='header-bar'>
          <Text className='record-count'>共 {records.length} 条记录</Text>
          <Text className='clear-btn' onClick={handleClearAll}>清空全部</Text>
        </View>
      )}

      {/* 加载中 */}
      {loading ? (
        <View className='empty-state'>
          <Text>加载中...</Text>
        </View>
      ) : records.length === 0 ? (
        /* 空状态 */
        <View className='empty-state'>
          <Image
            className='empty-icon'
            src='/assets/icons/history.png'
            mode='aspectFit'
          />
          <Text className='empty-text'>暂无历史记录</Text>
          <Text className='empty-hint'>去首页试试去水印功能吧</Text>
        </View>
      ) : (
        /* 记录列表 */
        <ScrollView className='record-list' scrollY>
          {records.map((record) => (
            <View
              key={record.id}
              className='record-item'
              onClick={() => handleViewDetail(record)}
            >
              {/* 封面 */}
              <View className='cover-wrapper'>
                <Image
                  className='cover-image'
                  src={record.coverUrl || record.resultUrls[0] || ''}
                  mode='aspectFill'
                />
                <View className='media-type-tag'>
                  <Text>{getMediaTypeLabel(record.mediaType)}</Text>
                </View>
                {record.savedToAlbum && (
                  <View className='saved-tag'>
                    <Text>已保存</Text>
                  </View>
                )}
              </View>

              {/* 信息 */}
              <View className='record-info'>
                <Text className='record-title' numberOfLines={2}>
                  {record.title || '无标题'}
                </Text>
                <View className='record-meta'>
                  <Text className='platform'>
                    {getPlatformName(record.platform || 'unknown')}
                  </Text>
                  <Text className='time'>{formatTime(record.createdAt)}</Text>
                </View>
              </View>

              {/* 删除按钮 */}
              <View
                className='delete-btn'
                onClick={(e) => handleDelete(record, e)}
              >
                <Text>删除</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}
