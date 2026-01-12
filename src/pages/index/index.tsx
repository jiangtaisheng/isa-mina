/**
 * 首页
 * 主要功能入口页面
 */

import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import FeatureCard from '../../components/FeatureCard'
import QuickEntry from '../../components/QuickEntry'
import AdBanner from '../../components/AdBanner'
import UrlInput from '../../components/UrlInput'
import ProcessingModal from '../../components/ProcessingModal'
import ResultCard from '../../components/ResultCard'
import { parseVideoUrl, ParseResult } from '../../services/watermark'
import './index.scss'

// 轮播图数据
const banners = [
  { id: '1', imageUrl: '/assets/banner/banner1.png' },
  { id: '2', imageUrl: '/assets/banner/banner2.png' },
  { id: '3', imageUrl: '/assets/banner/banner3.png' }
]

// 主功能数据
const features = [
  {
    id: 'album',
    title: '相册去水印',
    desc: '从相册选择视频/图片',
    icon: '/assets/icons/album.png',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'url',
    title: 'URL去水印',
    desc: '输入链接解析下载',
    icon: '/assets/icons/link.png',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
]

// 快捷入口数据
const entries = [
  { id: 'invite', title: '邀请好友', icon: '/assets/icons/invite.png' },
  { id: 'history', title: '去水印记录', icon: '/assets/icons/history.png' }
]

export default function Index() {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)

  // 处理相册选择
  const handleAlbumSelect = async () => {
    try {
      const res = await Taro.chooseMedia({
        count: 1,
        mediaType: ['image', 'video'],
        sourceType: ['album']
      })

      if (res.tempFiles && res.tempFiles.length > 0) {
        const file = res.tempFiles[0]
        const mediaType = file.fileType === 'video' ? 'video' : 'image'

        // 存储选择的媒体信息到全局数据
        const app = Taro.getApp()
        app.globalData = app.globalData || {}
        app.globalData.selectedMedia = {
          type: mediaType,
          path: file.tempFilePath,
          size: file.size,
          duration: file.duration
        }

        // 跳转到处理页面
        Taro.navigateTo({
          url: '/pages/process/index'
        })
      }
    } catch (err) {
      console.log('取消选择')
    }
  }

  // 显示URL输入
  const handleShowUrlInput = () => {
    setShowUrlInput(true)
    setParseResult(null)
  }

  // 处理URL解析
  const handleUrlSubmit = async (url: string) => {
    setParsing(true)
    setParseResult(null)

    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      const result = await parseVideoUrl(url)

      if (result.success) {
        setParseResult(result)
      } else {
        Taro.showToast({
          title: result.error || '解析失败',
          icon: 'none'
        })
      }
    } catch (err: any) {
      Taro.showToast({
        title: err.message || '解析失败',
        icon: 'none'
      })
    } finally {
      setParsing(false)
    }
  }

  // 跳转到结果页
  const handleViewResult = () => {
    if (!parseResult) return

    // 存储结果数据
    const app = Taro.getApp()
    app.globalData = app.globalData || {}
    app.globalData.parseResult = parseResult

    Taro.navigateTo({
      url: '/pages/result/index'
    })
  }

  // 处理邀请好友
  const handleInvite = () => {
    Taro.showShareMenu({
      withShareTicket: true
    })
    Taro.showToast({
      title: '请点击右上角分享',
      icon: 'none'
    })
  }

  // 处理查看记录
  const handleHistory = () => {
    Taro.navigateTo({
      url: '/pages/history/index'
    })
  }

  // 功能点击处理
  const handleFeatureClick = (id: string) => {
    if (id === 'album') {
      handleAlbumSelect()
    } else if (id === 'url') {
      handleShowUrlInput()
    }
  }

  // 入口点击处理
  const handleEntryClick = (id: string) => {
    if (id === 'invite') {
      handleInvite()
    } else if (id === 'history') {
      handleHistory()
    }
  }

  return (
    <View className='index-page'>
      {/* 轮播图区域 */}
      <View className='swiper-section'>
        <Swiper
          className='banner-swiper'
          indicatorDots
          indicatorColor='rgba(255,255,255,0.4)'
          indicatorActiveColor='#ffffff'
          autoplay
          circular
          interval={3000}
        >
          {banners.map((item) => (
            <SwiperItem key={item.id}>
              <Image
                className='banner-image'
                src={item.imageUrl}
                mode='aspectFill'
              />
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      {/* 主功能区 */}
      <View className='feature-section'>
        <View className='section-header'>
          <Text className='section-title'>核心功能</Text>
          <Text className='section-subtitle'>快速去除水印</Text>
        </View>
        <View className='feature-grid'>
          {features.map((item) => (
            <FeatureCard
              key={item.id}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
              gradient={item.gradient}
              onClick={() => handleFeatureClick(item.id)}
            />
          ))}
        </View>
      </View>

      {/* URL输入区域 */}
      {showUrlInput && (
        <View className='url-section'>
          <View className='section-header'>
            <Text className='section-title'>链接解析</Text>
            <Text
              className='close-btn'
              onClick={() => {
                setShowUrlInput(false)
                setParseResult(null)
              }}
            >
              收起
            </Text>
          </View>
          <UrlInput
            onSubmit={handleUrlSubmit}
            loading={parsing}
          />

          {/* 解析结果卡片 */}
          {parseResult && parseResult.success && (
            <View className='result-section'>
              <ResultCard
                result={parseResult}
                onClick={handleViewResult}
              />
            </View>
          )}
        </View>
      )}

      {/* 快捷入口 */}
      <View className='entry-section'>
        <View className='entry-grid'>
          {entries.map((item) => (
            <QuickEntry
              key={item.id}
              title={item.title}
              icon={item.icon}
              onClick={() => handleEntryClick(item.id)}
            />
          ))}
        </View>
      </View>

      {/* 广告区 */}
      <View className='ad-section'>
        <AdBanner />
      </View>

      {/* 处理中弹窗 */}
      <ProcessingModal
        visible={parsing}
        title='解析中'
        message='正在解析链接，请稍候...'
      />
    </View>
  )
}
