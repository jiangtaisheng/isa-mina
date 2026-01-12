import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Mine() {
  useLoad(() => {
    console.log('Mine page loaded.')
  })

  return (
    <View className='mine'>
      <Text>我的页面</Text>
    </View>
  )
}
