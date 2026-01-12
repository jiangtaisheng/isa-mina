import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Tools() {
  useLoad(() => {
    console.log('Tools page loaded.')
  })

  return (
    <View className='tools'>
      <Text>工具页面</Text>
    </View>
  )
}
