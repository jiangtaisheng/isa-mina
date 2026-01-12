# 技术设计文档: 首页功能实现

## Context

### 背景
首页是去水印工具小程序的核心页面，需要提供清晰的功能入口和良好的用户体验。页面分为4个主要区域：轮播图、主体功能区、快捷入口、广告区。

### 约束条件
- 微信小程序环境限制
- 需要调用微信 API（相册选择、文件保存等）
- 广告需要接入微信广告组件或第三方广告
- UI 需要美观且符合小程序设计规范

### 利益相关者
- 用户：需要简单易用的去水印功能
- 产品：需要清晰的功能展示和推广位
- 运营：需要广告位和邀请功能

## Goals / Non-Goals

### Goals
- 实现完整的首页 UI 布局
- 实现轮播图组件展示功能介绍
- 实现两种去水印入口（相册选择 / URL解析）
- 实现邀请好友和记录查看入口
- 预留广告展示区域
- 设计美观现代的 UI 界面

### Non-Goals
- 不在本阶段实现实际的去水印算法
- 不在本阶段接入真实的广告 SDK
- 不在本阶段实现后端服务对接

## 页面布局设计

### 整体结构

```
┌─────────────────────────────────┐
│          导航栏 (标题)            │
├─────────────────────────────────┤
│                                 │
│          轮播图区域              │
│        (功能介绍/推广)            │
│                                 │
├─────────────────────────────────┤
│                                 │
│        主体功能区                │
│  ┌───────────┐ ┌───────────┐   │
│  │  相册选择  │ │  URL解析   │   │
│  │  去水印    │ │  去水印    │   │
│  └───────────┘ └───────────┘   │
│                                 │
├─────────────────────────────────┤
│        快捷入口区                │
│  ┌───────────┐ ┌───────────┐   │
│  │  邀请好友  │ │  去水印记录 │   │
│  └───────────┘ └───────────┘   │
├─────────────────────────────────┤
│                                 │
│          广告展示区              │
│                                 │
└─────────────────────────────────┘
```

### 尺寸规范

| 区域 | 高度 | 说明 |
|-----|------|------|
| 轮播图 | 360rpx | 16:9 比例展示 |
| 主体功能区 | 280rpx | 两个大卡片 |
| 快捷入口 | 160rpx | 两个小入口 |
| 广告区 | 200rpx | 预留广告位 |

## Decisions

### Decision 1: 组件化设计

**选择**: 将页面拆分为独立组件

```
src/components/
├── Swiper/              # 轮播图组件
│   ├── index.tsx
│   └── index.scss
├── FeatureCard/         # 功能卡片组件
│   ├── index.tsx
│   └── index.scss
├── QuickEntry/          # 快捷入口组件
│   ├── index.tsx
│   └── index.scss
└── AdBanner/            # 广告横幅组件
    ├── index.tsx
    └── index.scss
```

**原因**:
- 提高代码复用性
- 便于维护和测试
- 清晰的职责划分

### Decision 2: 配色方案

**选择**: 现代简约风格

```scss
// 主题色
$primary-color: #1890ff;      // 主色调 - 蓝色
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// 功能色
$success-color: #52c41a;      // 成功 - 绿色
$warning-color: #faad14;      // 警告 - 橙色

// 背景色
$bg-color: #f5f7fa;           // 页面背景
$card-bg: #ffffff;            // 卡片背景

// 文字色
$text-primary: #333333;       // 主文字
$text-secondary: #666666;     // 次文字
$text-hint: #999999;          // 提示文字

// 阴影
$card-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
```

### Decision 3: 图标设计

**选择**: 使用线性图标风格

| 功能 | 图标名 | 说明 |
|-----|--------|------|
| 相册选择 | album.png | 图片/相册图标 |
| URL解析 | link.png | 链接图标 |
| 邀请好友 | invite.png | 分享/邀请图标 |
| 去水印记录 | history.png | 历史记录图标 |
| 轮播指示器 | dot.png | 圆点指示器 |

**图标规格**:
- 尺寸: 96px × 96px (3倍图)
- 格式: PNG (透明背景)
- 颜色: 主题蓝 (#1890ff) 或渐变色

### Decision 4: 交互设计

**主功能区卡片**:
```tsx
// 卡片样式
{
  width: '320rpx',
  height: '240rpx',
  borderRadius: '24rpx',
  background: 'linear-gradient(...)',
  boxShadow: '0 8rpx 32rpx rgba(0,0,0,0.12)'
}

// 点击效果
hover-class="card-hover"  // 缩放 0.98 + 阴影加深
```

**快捷入口**:
```tsx
// 入口样式
{
  width: '320rpx',
  height: '120rpx',
  borderRadius: '16rpx',
  background: '#ffffff',
  border: '2rpx solid #e8e8e8'
}
```

### Decision 5: 数据结构设计

**轮播图数据**:
```typescript
interface SwiperItem {
  id: string;
  imageUrl: string;
  title?: string;
  linkUrl?: string;
}

const swiperData: SwiperItem[] = [
  { id: '1', imageUrl: '/assets/banner/banner1.png', title: '一键去水印' },
  { id: '2', imageUrl: '/assets/banner/banner2.png', title: '支持多平台' },
  { id: '3', imageUrl: '/assets/banner/banner3.png', title: '免费使用' },
];
```

**功能入口数据**:
```typescript
interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  gradient: string;
  action: () => void;
}
```

## 目录结构设计

```
src/
├── pages/
│   └── index/
│       ├── index.tsx          # 首页主组件
│       ├── index.config.ts    # 页面配置
│       └── index.scss         # 页面样式
├── components/
│   ├── Swiper/                # 轮播图
│   ├── FeatureCard/           # 功能卡片
│   ├── QuickEntry/            # 快捷入口
│   └── AdBanner/              # 广告横幅
├── assets/
│   ├── icons/                 # 功能图标
│   │   ├── album.png
│   │   ├── link.png
│   │   ├── invite.png
│   │   └── history.png
│   └── banner/                # 轮播图片
│       ├── banner1.png
│       ├── banner2.png
│       └── banner3.png
└── services/
    └── watermark.ts           # 去水印服务（预留）
```

## 核心代码示例

### 首页组件结构

```tsx
// pages/index/index.tsx
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import FeatureCard from '@/components/FeatureCard'
import QuickEntry from '@/components/QuickEntry'
import AdBanner from '@/components/AdBanner'
import './index.scss'

export default function Index() {
  // 轮播图数据
  const banners = [...]

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

  return (
    <View className='index-page'>
      {/* 轮播图区域 */}
      <View className='swiper-section'>
        <Swiper
          className='banner-swiper'
          indicatorDots
          autoplay
          circular
        >
          {banners.map(item => (
            <SwiperItem key={item.id}>
              <Image src={item.imageUrl} mode='aspectFill' />
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      {/* 主功能区 */}
      <View className='feature-section'>
        <View className='section-title'>核心功能</View>
        <View className='feature-grid'>
          {features.map(item => (
            <FeatureCard key={item.id} {...item} />
          ))}
        </View>
      </View>

      {/* 快捷入口 */}
      <View className='entry-section'>
        <View className='entry-grid'>
          {entries.map(item => (
            <QuickEntry key={item.id} {...item} />
          ))}
        </View>
      </View>

      {/* 广告区 */}
      <View className='ad-section'>
        <AdBanner />
      </View>
    </View>
  )
}
```

### 样式设计

```scss
// pages/index/index.scss
.index-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
}

// 轮播图
.swiper-section {
  padding: 24rpx;

  .banner-swiper {
    height: 360rpx;
    border-radius: 24rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

// 功能区
.feature-section {
  padding: 24rpx;

  .section-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }

  .feature-grid {
    display: flex;
    justify-content: space-between;
    gap: 24rpx;
  }
}

// 快捷入口
.entry-section {
  padding: 24rpx;

  .entry-grid {
    display: flex;
    justify-content: space-between;
    gap: 24rpx;
  }
}

// 广告区
.ad-section {
  padding: 24rpx;

  .ad-placeholder {
    height: 200rpx;
    background: #fff;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }
}
```

## Risks / Trade-offs

### Risk 1: 去水印功能的技术实现
**风险**: 去水印涉及复杂的图像处理，小程序端处理能力有限
**缓解措施**:
- 可考虑服务端处理方案
- 对于简单水印可使用 Canvas 处理
- 分阶段实现，先完成 UI 和交互

### Risk 2: 广告接入兼容性
**风险**: 不同广告平台 SDK 可能存在兼容问题
**缓解措施**:
- 先使用占位区域
- 统一广告组件接口
- 支持多种广告类型切换

### Risk 3: 相册和文件权限
**风险**: 用户可能拒绝授权导致功能无法使用
**缓解措施**:
- 清晰的权限申请提示
- 优雅的降级处理
- 引导用户开启权限

## Migration Plan

### 步骤
1. 创建图标资源目录和图标文件
2. 创建公共组件（Swiper、FeatureCard、QuickEntry、AdBanner）
3. 创建轮播图占位图片
4. 重构首页组件，集成各模块
5. 添加样式和交互效果
6. 构建验证

### 回滚方案
- 保留原首页代码作为备份
- 可快速切换回简单版本

## Open Questions

1. 去水印的具体实现方案是什么？（本地处理 vs 服务端处理）
2. 广告使用微信官方广告还是第三方广告平台？
3. 邀请好友功能需要对接后端吗？
4. 去水印记录存储在本地还是服务器？
5. 是否需要用户登录功能？
