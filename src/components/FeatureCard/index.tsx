import { View, Image, Text } from '@tarojs/components'
import './index.scss'

interface FeatureCardProps {
  title: string
  desc: string
  icon: string
  gradient: string
  onClick?: () => void
}

export default function FeatureCard({ title, desc, icon, gradient, onClick }: FeatureCardProps) {
  return (
    <View
      className='feature-card'
      style={{ background: gradient }}
      onClick={onClick}
      hoverClass='feature-card-hover'
    >
      <View className='card-content'>
        <Image className='card-icon' src={icon} mode='aspectFit' />
        <View className='card-text'>
          <Text className='card-title'>{title}</Text>
          <Text className='card-desc'>{desc}</Text>
        </View>
      </View>
    </View>
  )
}
