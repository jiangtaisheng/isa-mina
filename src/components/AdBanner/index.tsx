import { View, Text } from '@tarojs/components'
import './index.scss'

interface AdBannerProps {
  adUnitId?: string
}

export default function AdBanner({ adUnitId }: AdBannerProps) {
  // 如果有广告单元ID，可以接入真实广告
  // 目前显示占位区域

  return (
    <View className='ad-banner'>
      {adUnitId ? (
        // 真实广告组件
        <View className='ad-content'>
          <Text>广告加载中...</Text>
        </View>
      ) : (
        // 占位区域
        <View className='ad-placeholder'>
          <Text className='ad-text'>广告位</Text>
          <Text className='ad-hint'>接入第三方广告后展示</Text>
        </View>
      )}
    </View>
  )
}
