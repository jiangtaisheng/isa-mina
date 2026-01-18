/**
 * HTTP 请求包装器
 * 提供 SID 注入、错误处理和 401 重定向
 */

import Taro from '@tarojs/taro';
import { getSid, clearTokens } from '../services/auth';

// API 基础地址
const API_BASE_URL = 'https://api.jiangtaisheng.top';

/**
 * 请求配置接口
 */
interface RequestOptions extends Taro.request.Task {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

/**
 * 响应数据接口
 */
interface ResponseData<T = any> {
  code: number;
  message: string;
  data?: T;
}

/**
 * HTTP 请求方法
 */
export const request = async <T = any>(options: RequestOptions): Promise<ResponseData<T>> => {
  // 获取 sid
  const sid = getSid();

  // 构建完整 URL
  const fullUrl = options.url.startsWith('http')
    ? options.url
    : `${API_BASE_URL}${options.url}`;

  // 构建请求头，自动注入 sid
  const headers = {
    'Content-Type': 'application/json',
    ...options.header,
    ...(sid ? { sid } : {})
  };

  try {
    // 发起请求
    const response = await Taro.request({
      url: fullUrl,
      method: options.method || 'GET',
      data: options.data,
      header: headers,
      timeout: options.timeout || 10000 // 默认 10 秒超时
    });

    const responseData = response.data as ResponseData<T>;

    // 检查 401 未授权状态
    if (responseData.code === 401 || response.statusCode === 401) {
      console.warn('未授权，清除 token 并跳转到登录页');

      // 清除认证信息
      clearTokens();

      // 跳转到登录页
      Taro.navigateTo({
        url: '/pages/login/index'
      });

      throw new Error('未授权，请重新登录');
    }

    // 检查其他错误状态
    if (responseData.code !== 0) {
      throw new Error(responseData.message || '请求失败');
    }

    return responseData;
  } catch (error: any) {
    console.error('请求失败:', error);

    // 处理网络错误
    if (error.errMsg && error.errMsg.includes('timeout')) {
      throw new Error('网络超时，请检查网络连接');
    }

    if (error.errMsg && error.errMsg.includes('fail')) {
      throw new Error('网络连接失败，请检查网络设置');
    }

    // 重新抛出错误
    throw error;
  }
};

/**
 * GET 请求
 */
export const get = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<ResponseData<T>> => {
  return request<T>({
    url,
    method: 'GET',
    data,
    ...options
  });
};

/**
 * POST 请求
 */
export const post = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<ResponseData<T>> => {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...options
  });
};

/**
 * PUT 请求
 */
export const put = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<ResponseData<T>> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

/**
 * DELETE 请求
 */
export const del = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<ResponseData<T>> => {
  return request<T>({
    url,
    method: 'DELETE',
    data,
    ...options
  });
};

export default {
  request,
  get,
  post,
  put,
  delete: del
};
