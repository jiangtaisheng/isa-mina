import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Task() {
  useLoad(() => {
    console.log('Task page loaded.')
  })

  return (
    <View className='task'>
      <Text>任务页面</Text>
    </View>
  )
}
