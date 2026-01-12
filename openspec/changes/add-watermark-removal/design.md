# 技术设计文档: 去水印功能实现

## Context

### 背景
去水印功能是本小程序的核心能力，需要支持两种主要场景：
1. **短视频平台链接解析** - 解析抖音、快手、小红书等平台的视频链接，获取无水印原视频
2. **本地媒体去水印** - 对用户上传的图片/视频进行水印去除处理

### 约束条件
- 微信小程序端计算能力有限，复杂图像处理需要服务端支持
- 需要遵守各平台的使用规范
- 用户隐私和数据安全需要保障
- 处理速度需要在可接受范围内

### 利益相关者
- 用户：需要快速、高质量的去水印服务
- 开发团队：需要可维护的技术方案
- 运营：需要稳定可靠的服务

## Goals / Non-Goals

### Goals
- 实现短视频平台（抖音、快手、小红书、微博等）的无水印视频解析
- 实现本地图片的简单水印去除
- 提供友好的处理进度和结果展示
- 支持处理结果保存到相册
- 记录用户的去水印历史

### Non-Goals
- 不实现复杂的 AI 水印去除（如深度学习修复）
- 不保证 100% 去除所有类型水印
- 不提供批量处理功能（第一期）
- 不实现视频编辑功能

## 技术方案分析

### 方案一：短视频平台 URL 解析（推荐）

**原理**：短视频平台的水印通常是在播放时叠加的，原始视频文件本身是无水印的。通过解析分享链接，可以获取无水印的原视频地址。

**支持平台**：
| 平台 | 链接格式 | 解析难度 |
|-----|---------|---------|
| 抖音 | v.douyin.com / www.douyin.com | 中 |
| 快手 | v.kuaishou.com | 中 |
| 小红书 | xhslink.com / xiaohongshu.com | 中 |
| 微博 | weibo.com / weibo.cn | 低 |
| 皮皮虾 | h5.pipix.com | 低 |
| 西瓜视频 | www.ixigua.com | 中 |

**开源方案**：
1. **TikTokDownloader** - Python 实现，支持抖音
2. **video-url-parser** - Node.js 实现，支持多平台
3. **社区 API** - 免费/付费的第三方解析 API

### 方案二：本地图片去水印

**技术选型**：

| 方案 | 优点 | 缺点 | 推荐度 |
|-----|------|------|--------|
| Canvas 裁剪 | 简单、客户端处理 | 只能裁剪固定位置水印 | ⭐⭐⭐ |
| 服务端 OpenCV | 效果好、支持复杂场景 | 需要服务器、延迟高 | ⭐⭐⭐⭐ |
| 第三方 API | 效果最好、无需维护 | 成本高、依赖第三方 | ⭐⭐⭐ |
| WebAssembly + OpenCV | 客户端处理、效果好 | 包体积大、兼容性问题 | ⭐⭐ |

### 方案三：本地视频去水印

由于视频处理计算量大，推荐使用服务端处理：
- FFmpeg 逐帧提取 + 图像处理 + 重新编码
- 或使用专业的视频处理 API

## Decisions

### Decision 1: 采用混合架构

**选择**: 客户端 + 服务端混合处理

```
┌─────────────────────────────────────────────────┐
│                    小程序端                      │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐              │
│  │  URL 输入   │  │  相册选择   │              │
│  └──────┬──────┘  └──────┬──────┘              │
│         │                │                      │
│         ▼                ▼                      │
│  ┌─────────────────────────────┐               │
│  │      去水印服务层            │               │
│  │  - URL 解析               │               │
│  │  - 本地图片处理（简单）     │               │
│  └──────────────┬──────────────┘               │
└─────────────────┼───────────────────────────────┘
                  │
                  ▼ (复杂处理)
┌─────────────────────────────────────────────────┐
│                   服务端                         │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐              │
│  │ URL 解析API │  │ 图像处理API │              │
│  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────┘
```

**原因**：
- URL 解析需要服务端绕过跨域限制
- 复杂图像处理需要服务端算力
- 简单处理可以客户端完成，提升体验

### Decision 2: URL 解析服务实现

**选择**: 使用 Node.js 服务端 + 开源解析库

**技术栈**：
- 服务端: Node.js + Express/Koa
- 解析库: 自研 + 开源参考
- 缓存: Redis（可选）

**解析流程**：
```typescript
// 解析服务接口
interface ParseResult {
  success: boolean;
  platform: string;        // 平台名称
  title: string;           // 视频标题
  author: string;          // 作者名称
  videoUrl: string;        // 无水印视频地址
  coverUrl: string;        // 封面图地址
  duration?: number;       // 视频时长
  error?: string;          // 错误信息
}

// API 端点
POST /api/parse
Body: { url: string }
Response: ParseResult
```

**核心解析逻辑**（以抖音为例）：
```typescript
async function parseDouyin(shareUrl: string): Promise<ParseResult> {
  // 1. 获取重定向后的真实URL
  const realUrl = await followRedirect(shareUrl);

  // 2. 提取视频ID
  const videoId = extractVideoId(realUrl);

  // 3. 调用抖音内部API获取视频信息
  const videoInfo = await fetchVideoInfo(videoId);

  // 4. 提取无水印视频地址
  const noWatermarkUrl = videoInfo.video.play_addr.url_list[0]
    .replace('playwm', 'play');

  return {
    success: true,
    platform: 'douyin',
    title: videoInfo.desc,
    author: videoInfo.author.nickname,
    videoUrl: noWatermarkUrl,
    coverUrl: videoInfo.video.cover.url_list[0]
  };
}
```

### Decision 3: 本地图片去水印方案

**选择**: Canvas 裁剪 + 服务端高级处理

**方案 A - 客户端 Canvas 裁剪**（简单场景）：
```typescript
// 适用于固定位置水印（如右下角 logo）
async function cropWatermark(
  imagePath: string,
  cropArea: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const ctx = Taro.createCanvasContext('watermarkCanvas');

  // 加载图片
  const imageInfo = await Taro.getImageInfo({ src: imagePath });

  // 绘制裁剪区域
  ctx.drawImage(
    imagePath,
    cropArea.x, cropArea.y,
    cropArea.width, cropArea.height,
    0, 0,
    cropArea.width, cropArea.height
  );

  // 导出图片
  return new Promise((resolve) => {
    ctx.draw(false, () => {
      Taro.canvasToTempFilePath({
        canvasId: 'watermarkCanvas',
        success: (res) => resolve(res.tempFilePath)
      });
    });
  });
}
```

**方案 B - 服务端图像修复**（复杂场景）：
```python
# 服务端 Python + OpenCV 实现
import cv2
import numpy as np

def remove_watermark_inpaint(image_path, mask_path):
    """使用图像修复算法去除水印"""
    image = cv2.imread(image_path)
    mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

    # 使用 NS 或 TELEA 算法进行图像修复
    result = cv2.inpaint(image, mask, 3, cv2.INPAINT_TELEA)

    return result

def auto_detect_watermark(image_path):
    """自动检测水印位置（基于模板匹配或边缘检测）"""
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 边缘检测
    edges = cv2.Canny(gray, 50, 150)

    # 查找水印区域（通常在角落）
    # ... 具体实现

    return watermark_region
```

### Decision 4: 数据存储方案

**选择**: 本地存储 + 云存储（可选）

```typescript
// 去水印记录数据结构
interface WatermarkRecord {
  id: string;                    // 唯一ID
  type: 'url' | 'image' | 'video';  // 类型
  sourceUrl?: string;            // 原始URL
  platform?: string;             // 平台
  title?: string;                // 标题
  resultUrl: string;             // 结果地址
  coverUrl?: string;             // 封面
  createdAt: number;             // 创建时间
  savedToAlbum: boolean;         // 是否已保存到相册
}

// 本地存储
const STORAGE_KEY = 'watermark_records';
const MAX_RECORDS = 50;  // 最多保存50条记录
```

### Decision 5: 服务端架构（可选部署）

**选择**: 轻量级 Node.js 服务

```
server/
├── src/
│   ├── app.ts              # 应用入口
│   ├── routes/
│   │   ├── parse.ts        # URL 解析路由
│   │   └── process.ts      # 图像处理路由
│   ├── services/
│   │   ├── parser/         # 各平台解析器
│   │   │   ├── douyin.ts
│   │   │   ├── kuaishou.ts
│   │   │   ├── xiaohongshu.ts
│   │   │   └── index.ts
│   │   └── image/          # 图像处理服务
│   │       └── watermark.ts
│   └── utils/
│       ├── request.ts      # HTTP 请求封装
│       └── cache.ts        # 缓存工具
├── package.json
└── Dockerfile
```

## 目录结构设计

```
src/
├── pages/
│   ├── index/                    # 首页（已有）
│   ├── result/                   # 去水印结果页（新增）
│   │   ├── index.tsx
│   │   ├── index.config.ts
│   │   └── index.scss
│   └── history/                  # 历史记录页（新增）
│       ├── index.tsx
│       ├── index.config.ts
│       └── index.scss
├── services/
│   ├── watermark/                # 去水印服务
│   │   ├── index.ts             # 服务入口
│   │   ├── parser.ts            # URL 解析器
│   │   ├── processor.ts         # 图像处理器
│   │   └── types.ts             # 类型定义
│   └── storage/                  # 存储服务
│       └── records.ts           # 记录管理
├── components/
│   ├── UrlInput/                 # URL 输入组件
│   ├── ProcessingModal/          # 处理中弹窗
│   └── ResultCard/               # 结果卡片组件
└── utils/
    ├── platform.ts               # 平台识别工具
    └── download.ts               # 下载工具
```

## 核心流程设计

### URL 去水印流程

```
用户输入URL
    │
    ▼
识别平台类型
    │
    ├── 抖音 ──► 抖音解析器
    ├── 快手 ──► 快手解析器
    ├── 小红书 ──► 小红书解析器
    └── 其他 ──► 通用解析器
    │
    ▼
调用解析API
    │
    ├── 成功 ──► 返回无水印视频URL
    │              │
    │              ▼
    │           显示结果页
    │              │
    │              ▼
    │           保存到相册
    │
    └── 失败 ──► 显示错误提示
```

### 本地图片去水印流程

```
用户选择图片
    │
    ▼
分析图片（检测水印位置）
    │
    ├── 简单水印（角落logo）
    │       │
    │       ▼
    │   Canvas裁剪处理
    │
    └── 复杂水印
            │
            ▼
        上传到服务端
            │
            ▼
        OpenCV处理
            │
            ▼
        返回处理结果
    │
    ▼
显示处理结果
    │
    ▼
保存到相册
```

## API 设计

### 小程序端服务接口

```typescript
// services/watermark/index.ts

/**
 * 解析短视频平台 URL
 */
export async function parseVideoUrl(url: string): Promise<ParseResult>;

/**
 * 处理本地图片去水印
 */
export async function processImage(
  imagePath: string,
  options?: ProcessOptions
): Promise<ProcessResult>;

/**
 * 下载并保存到相册
 */
export async function saveToAlbum(
  url: string,
  type: 'image' | 'video'
): Promise<boolean>;

/**
 * 获取历史记录
 */
export async function getRecords(): Promise<WatermarkRecord[]>;

/**
 * 添加历史记录
 */
export async function addRecord(record: WatermarkRecord): Promise<void>;
```

### 服务端 API（如果需要）

```
POST /api/parse
  - 解析视频链接，返回无水印地址

POST /api/process/image
  - 上传图片进行去水印处理

GET /api/health
  - 健康检查
```

## 开源框架推荐

### URL 解析相关
1. **douyin-parse** - 抖音视频解析
2. **kuaishou-parse** - 快手视频解析
3. **social-video-downloader** - 多平台支持

### 图像处理相关
1. **OpenCV.js** - JavaScript 版 OpenCV
2. **Sharp** - Node.js 高性能图像处理
3. **Jimp** - 纯 JavaScript 图像处理

### 参考项目
1. [TikTokDownloader](https://github.com/Johnserf-Seed/TikTokDownloader) - Python
2. [douyin-downloader](https://github.com/xxNull-lsk/douyin-downloader) - Go
3. [video-parse](https://github.com/iawia002/lux) - Go 多平台下载器

## Risks / Trade-offs

### Risk 1: 平台接口变更
**风险**: 短视频平台可能随时更改接口，导致解析失败
**缓解措施**:
- 建立监控告警机制
- 保持解析器模块化，便于快速更新
- 准备多个备用解析方案

### Risk 2: 法律合规风险
**风险**: 去水印功能可能涉及版权问题
**缓解措施**:
- 添加用户协议，声明仅供个人学习使用
- 不提供商业用途的批量处理
- 保留原作者信息

### Risk 3: 服务稳定性
**风险**: 依赖第三方服务可能不稳定
**缓解措施**:
- 实现请求重试机制
- 提供多个解析源切换
- 本地缓存已解析结果

### Risk 4: 小程序审核
**风险**: 去水印功能可能影响小程序审核
**缓解措施**:
- 功能描述中强调"个人使用"
- 不在小程序名称中包含敏感词
- 提供合规的用户协议

## Migration Plan

### 第一阶段：URL 解析功能
1. 实现 URL 解析服务
2. 实现结果展示页面
3. 实现保存到相册功能
4. 实现历史记录功能

### 第二阶段：本地图片处理
1. 实现 Canvas 裁剪功能
2. 实现简单水印检测
3. （可选）接入服务端处理

### 第三阶段：优化完善
1. 增加更多平台支持
2. 优化处理速度
3. 增加批量处理功能

## Open Questions

1. 是否需要自建服务端？还是使用第三方 API？
2. 本地图片去水印的精度要求是什么级别？
3. 是否需要支持视频的本地去水印？
4. 历史记录是否需要云同步？
5. 是否需要会员/付费功能限制？
