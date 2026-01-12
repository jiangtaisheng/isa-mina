/**
 * 本地媒体处理页面
 * 用于处理本地选择的图片/视频去水印
 */

import { View, Text, Image, Canvas, Video, Button, MovableArea, MovableView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { saveImageToAlbum, requestAlbumPermission } from '../../services/watermark'
import { addRecord } from '../../services/storage/records'
import './index.scss'

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface ImageInfo {
  width: number
  height: number
  path: string
}

export default function Process() {
  const router = useRouter()
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [originalPath, setOriginalPath] = useState('')
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [resultPath, setResultPath] = useState('')
  const [saving, setSaving] = useState(false)

  // 裁剪区域状态
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 100,
    height: 50
  })

  // 显示尺寸
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [containerWidth, setContainerWidth] = useState(0)

  // Canvas上下文
  const canvasRef = useRef<any>(null)

  useEffect(() => {
    // 从全局数据获取选择的媒体
    const app = Taro.getApp()
    const selectedMedia = app.globalData?.selectedMedia

    if (selectedMedia) {
      setMediaType(selectedMedia.type)
      setOriginalPath(selectedMedia.path)

      if (selectedMedia.type === 'image') {
        loadImageInfo(selectedMedia.path)
      }
    } else {
      Taro.showToast({ title: '未选择文件', icon: 'none' })
      setTimeout(() => Taro.navigateBack(), 1500)
    }

    // 获取屏幕宽度
    const sysInfo = Taro.getSystemInfoSync()
    setContainerWidth(sysInfo.windowWidth - 48) // 减去padding
  }, [])

  // 加载图片信息
  const loadImageInfo = async (path: string) => {
    try {
      const info = await Taro.getImageInfo({ src: path })
      setImageInfo({
        width: info.width,
        height: info.height,
        path: info.path
      })

      // 计算显示尺寸
      const sysInfo = Taro.getSystemInfoSync()
      const maxWidth = sysInfo.windowWidth - 48
      const maxHeight = 400

      let displayWidth = info.width
      let displayHeight = info.height

      // 按比例缩放
      if (displayWidth > maxWidth) {
        const ratio = maxWidth / displayWidth
        displayWidth = maxWidth
        displayHeight = displayHeight * ratio
      }
      if (displayHeight > maxHeight) {
        const ratio = maxHeight / displayHeight
        displayHeight = maxHeight
        displayWidth = displayWidth * ratio
      }

      setDisplaySize({ width: displayWidth, height: displayHeight })

      // 初始化裁剪区域（底部区域，常见水印位置）
      setCropArea({
        x: 0,
        y: displayHeight - 60,
        width: displayWidth,
        height: 60
      })
    } catch (err) {
      console.error('加载图片失败:', err)
      Taro.showToast({ title: '加载图片失败', icon: 'none' })
    }
  }

  // 处理裁剪区域移动
  const handleCropMove = (e: any) => {
    const { x, y } = e.detail
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, x),
      y: Math.max(0, y)
    }))
  }

  // 调整裁剪区域大小
  const adjustCropSize = (type: 'height' | 'width', delta: number) => {
    setCropArea(prev => {
      const newArea = { ...prev }
      if (type === 'height') {
        newArea.height = Math.max(20, Math.min(displaySize.height, prev.height + delta))
      } else {
        newArea.width = Math.max(50, Math.min(displaySize.width, prev.width + delta))
      }
      return newArea
    })
  }

  // 快速选择预设区域
  const selectPreset = (position: 'top' | 'bottom' | 'left' | 'right') => {
    const presets = {
      top: { x: 0, y: 0, width: displaySize.width, height: 60 },
      bottom: { x: 0, y: displaySize.height - 60, width: displaySize.width, height: 60 },
      left: { x: 0, y: 0, width: 80, height: displaySize.height },
      right: { x: displaySize.width - 80, y: 0, width: 80, height: displaySize.height }
    }
    setCropArea(presets[position])
  }

  // 执行裁剪处理
  const handleProcess = async () => {
    if (!imageInfo || processing) return

    setProcessing(true)

    try {
      // 计算实际裁剪区域（根据显示比例转换为实际像素）
      const scaleX = imageInfo.width / displaySize.width
      const scaleY = imageInfo.height / displaySize.height

      const actualCrop = {
        x: Math.round(cropArea.x * scaleX),
        y: Math.round(cropArea.y * scaleY),
        width: Math.round(cropArea.width * scaleX),
        height: Math.round(cropArea.height * scaleY)
      }

      // 使用Canvas处理图片（去除水印区域）
      const result = await processImageWithCanvas(imageInfo, actualCrop)

      setResultPath(result)
      setProcessed(true)

      // 保存到历史记录
      await addRecord({
        type: 'image',
        mediaType: 'image',
        title: '本地图片去水印',
        resultUrls: [result],
        coverUrl: result,
        savedToAlbum: false
      })

      Taro.showToast({ title: '处理完成', icon: 'success' })
    } catch (err: any) {
      console.error('处理失败:', err)
      Taro.showToast({ title: err.message || '处理失败', icon: 'none' })
    } finally {
      setProcessing(false)
    }
  }

  // Canvas处理图片
  const processImageWithCanvas = (info: ImageInfo, crop: CropArea): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 计算裁剪后的尺寸
      // 方案：将水印区域裁掉，保留其余部分
      const newHeight = info.height - crop.height
      const newWidth = info.width

      if (newHeight <= 0) {
        reject(new Error('裁剪区域过大'))
        return
      }

      const query = Taro.createSelectorQuery()
      query.select('#processCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]?.node) {
            reject(new Error('Canvas初始化失败'))
            return
          }

          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          // 设置canvas尺寸
          canvas.width = newWidth
          canvas.height = newHeight

          // 加载图片
          const img = canvas.createImage()
          img.onload = () => {
            // 根据裁剪区域位置决定如何绘制
            if (crop.y === 0) {
              // 水印在顶部，从水印下方开始绘制
              ctx.drawImage(
                img,
                0, crop.height,           // 源图起点
                info.width, newHeight,    // 源图尺寸
                0, 0,                      // 目标起点
                newWidth, newHeight       // 目标尺寸
              )
            } else if (crop.y + crop.height >= info.height) {
              // 水印在底部，只绘制上方
              ctx.drawImage(
                img,
                0, 0,
                info.width, newHeight,
                0, 0,
                newWidth, newHeight
              )
            } else {
              // 水印在中间，分两部分绘制
              const topHeight = crop.y
              const bottomHeight = info.height - crop.y - crop.height

              // 绘制上半部分
              ctx.drawImage(
                img,
                0, 0,
                info.width, topHeight,
                0, 0,
                newWidth, topHeight
              )
              // 绘制下半部分
              ctx.drawImage(
                img,
                0, crop.y + crop.height,
                info.width, bottomHeight,
                0, topHeight,
                newWidth, bottomHeight
              )
            }

            // 导出图片
            Taro.canvasToTempFilePath({
              canvas,
              x: 0,
              y: 0,
              width: newWidth,
              height: newHeight,
              destWidth: newWidth,
              destHeight: newHeight,
              fileType: 'png',
              quality: 1,
              success: (res) => {
                resolve(res.tempFilePath)
              },
              fail: (err) => {
                reject(new Error(err.errMsg || '导出失败'))
              }
            })
          }
          img.onerror = () => {
            reject(new Error('图片加载失败'))
          }
          img.src = info.path
        })
    })
  }

  // 保存到相册
  const handleSave = async () => {
    if (!resultPath || saving) return

    const hasPermission = await requestAlbumPermission()
    if (!hasPermission) {
      Taro.showToast({ title: '请授权相册权限', icon: 'none' })
      return
    }

    setSaving(true)
    try {
      const result = await saveImageToAlbum(resultPath)
      if (result.success) {
        Taro.showToast({ title: '保存成功', icon: 'success' })
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      Taro.showToast({ title: err.message || '保存失败', icon: 'none' })
    } finally {
      setSaving(false)
    }
  }

  // 重新处理
  const handleReset = () => {
    setProcessed(false)
    setResultPath('')
  }

  return (
    <View className='process-page'>
      {/* 标题区 */}
      <View className='header'>
        <Text className='title'>
          {mediaType === 'image' ? '图片去水印' : '视频去水印'}
        </Text>
        <Text className='subtitle'>
          {processed ? '处理完成，可保存到相册' : '选择水印区域进行裁剪'}
        </Text>
      </View>

      {/* 预览区 */}
      <View className='preview-section'>
        {mediaType === 'image' && !processed && imageInfo && (
          <View className='image-editor'>
            <MovableArea
              className='movable-area'
              style={{ width: `${displaySize.width}px`, height: `${displaySize.height}px` }}
            >
              {/* 原图 */}
              <Image
                className='preview-image'
                src={originalPath}
                mode='aspectFit'
                style={{ width: `${displaySize.width}px`, height: `${displaySize.height}px` }}
              />

              {/* 可移动的裁剪框 */}
              <MovableView
                className='crop-box'
                x={cropArea.x}
                y={cropArea.y}
                direction='all'
                onChange={handleCropMove}
                style={{
                  width: `${cropArea.width}px`,
                  height: `${cropArea.height}px`
                }}
              >
                <View className='crop-inner'>
                  <Text className='crop-label'>水印区域</Text>
                </View>
              </MovableView>
            </MovableArea>
          </View>
        )}

        {/* 处理后预览 */}
        {processed && resultPath && (
          <View className='result-preview'>
            <Image
              className='result-image'
              src={resultPath}
              mode='aspectFit'
              showMenuByLongpress
            />
          </View>
        )}

        {/* 视频预览 */}
        {mediaType === 'video' && (
          <View className='video-preview'>
            <Video
              className='preview-video'
              src={originalPath}
              controls
              showCenterPlayBtn
            />
            <View className='video-tip'>
              <Text>视频去水印需要服务端处理</Text>
              <Text>功能开发中...</Text>
            </View>
          </View>
        )}
      </View>

      {/* 裁剪控制区（仅图片且未处理时显示） */}
      {mediaType === 'image' && !processed && (
        <View className='control-section'>
          {/* 预设位置 */}
          <View className='preset-row'>
            <Text className='row-label'>快速选择：</Text>
            <View className='preset-buttons'>
              <Button className='preset-btn' onClick={() => selectPreset('top')}>顶部</Button>
              <Button className='preset-btn' onClick={() => selectPreset('bottom')}>底部</Button>
              <Button className='preset-btn' onClick={() => selectPreset('left')}>左侧</Button>
              <Button className='preset-btn' onClick={() => selectPreset('right')}>右侧</Button>
            </View>
          </View>

          {/* 高度调整 */}
          <View className='size-row'>
            <Text className='row-label'>区域高度：</Text>
            <View className='size-buttons'>
              <Button className='size-btn' onClick={() => adjustCropSize('height', -10)}>-</Button>
              <Text className='size-value'>{Math.round(cropArea.height)}px</Text>
              <Button className='size-btn' onClick={() => adjustCropSize('height', 10)}>+</Button>
            </View>
          </View>
        </View>
      )}

      {/* Canvas（隐藏） */}
      <Canvas
        type='2d'
        id='processCanvas'
        className='hidden-canvas'
        style={{ width: '1px', height: '1px' }}
      />

      {/* 操作按钮 */}
      <View className='action-bar'>
        {!processed ? (
          <Button
            className='process-btn'
            onClick={handleProcess}
            disabled={processing || mediaType === 'video'}
          >
            {processing ? '处理中...' : '开始处理'}
          </Button>
        ) : (
          <>
            <Button className='reset-btn' onClick={handleReset}>
              重新处理
            </Button>
            <Button
              className='save-btn'
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '保存中...' : '保存到相册'}
            </Button>
          </>
        )}
      </View>

      {/* 提示 */}
      <View className='tips'>
        <Text className='tip-text'>提示：拖动红色框选择要去除的水印区域</Text>
      </View>
    </View>
  )
}
