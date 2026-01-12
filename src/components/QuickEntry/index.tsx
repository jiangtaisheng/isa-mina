import { View, Image, Text } from '@tarojs/components'
import './index.scss'

interface QuickEntryProps {
  title: string
  icon: string
  onClick?: () => void
}

export default function QuickEntry({ title, icon, onClick }: QuickEntryProps) {
  return (
    <View className='quick-entry' onClick={onClick} hoverClass='quick-entry-hover'>
      <Image className='entry-icon' src={icon} mode='aspectFit' />
      <Text className='entry-title'>{title}</Text>
    </View>
  )
}
