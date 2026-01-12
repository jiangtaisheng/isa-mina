/**
 * 存储服务 - 历史记录管理
 * 用于管理去水印历史记录的增删改查
 */

import Taro from '@tarojs/taro'
import { WatermarkRecord } from '../watermark/types'

// 存储键名
const STORAGE_KEY = 'watermark_records'

// 最大记录数
const MAX_RECORDS = 50

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 获取所有历史记录
 * @returns 历史记录列表（按时间倒序）
 */
export async function getRecords(): Promise<WatermarkRecord[]> {
  try {
    const data = Taro.getStorageSync(STORAGE_KEY)
    if (data) {
      const records = JSON.parse(data) as WatermarkRecord[]
      // 按时间倒序排列
      return records.sort((a, b) => b.createdAt - a.createdAt)
    }
    return []
  } catch (err) {
    console.error('获取历史记录失败:', err)
    return []
  }
}

/**
 * 添加历史记录
 * @param record 记录数据（不含id和createdAt）
 * @returns 添加后的完整记录
 */
export async function addRecord(
  record: Omit<WatermarkRecord, 'id' | 'createdAt'>
): Promise<WatermarkRecord> {
  try {
    const records = await getRecords()

    // 创建新记录
    const newRecord: WatermarkRecord = {
      ...record,
      id: generateId(),
      createdAt: Date.now()
    }

    // 添加到列表开头
    records.unshift(newRecord)

    // 限制记录数量
    const limitedRecords = records.slice(0, MAX_RECORDS)

    // 保存
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(limitedRecords))

    return newRecord
  } catch (err) {
    console.error('添加历史记录失败:', err)
    throw err
  }
}

/**
 * 更新历史记录
 * @param id 记录ID
 * @param updates 更新的字段
 * @returns 更新后的记录
 */
export async function updateRecord(
  id: string,
  updates: Partial<WatermarkRecord>
): Promise<WatermarkRecord | null> {
  try {
    const records = await getRecords()
    const index = records.findIndex((r) => r.id === id)

    if (index === -1) {
      return null
    }

    // 更新记录
    records[index] = {
      ...records[index],
      ...updates
    }

    // 保存
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(records))

    return records[index]
  } catch (err) {
    console.error('更新历史记录失败:', err)
    throw err
  }
}

/**
 * 删除历史记录
 * @param id 记录ID
 * @returns 是否删除成功
 */
export async function deleteRecord(id: string): Promise<boolean> {
  try {
    const records = await getRecords()
    const filteredRecords = records.filter((r) => r.id !== id)

    if (filteredRecords.length === records.length) {
      return false
    }

    // 保存
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(filteredRecords))

    return true
  } catch (err) {
    console.error('删除历史记录失败:', err)
    return false
  }
}

/**
 * 清空所有历史记录
 * @returns 是否清空成功
 */
export async function clearRecords(): Promise<boolean> {
  try {
    Taro.removeStorageSync(STORAGE_KEY)
    return true
  } catch (err) {
    console.error('清空历史记录失败:', err)
    return false
  }
}

/**
 * 获取单条历史记录
 * @param id 记录ID
 * @returns 记录数据或null
 */
export async function getRecordById(id: string): Promise<WatermarkRecord | null> {
  try {
    const records = await getRecords()
    return records.find((r) => r.id === id) || null
  } catch (err) {
    console.error('获取历史记录失败:', err)
    return null
  }
}

/**
 * 获取历史记录数量
 * @returns 记录数量
 */
export async function getRecordCount(): Promise<number> {
  try {
    const records = await getRecords()
    return records.length
  } catch (err) {
    console.error('获取历史记录数量失败:', err)
    return 0
  }
}

/**
 * 标记记录已保存到相册
 * @param id 记录ID
 * @returns 更新后的记录
 */
export async function markAsSaved(id: string): Promise<WatermarkRecord | null> {
  return updateRecord(id, { savedToAlbum: true })
}
