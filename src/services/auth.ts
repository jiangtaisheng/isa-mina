/**
 * 认证服务
 * 处理用户注册、登录、自动登录和 token 管理
 */

import Taro from '@tarojs/taro';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AutoLoginRequest,
  TokenData
} from '../types/auth';

// API 基础地址
const API_BASE_URL = 'https://api.jiangtaisheng.top';

// Storage 键名
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  SID: 'auth_sid',
  EXPIRES: 'auth_expires'
};

/**
 * 用户注册
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}/auth/register`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        username: data.username,
        password: data.password
      }
    });

    return response.data as AuthResponse;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

/**
 * 用户登录
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  console.log('=== Auth Service: 登录 API 调用开始 ===');
  console.log('API 地址:', `${API_BASE_URL}/api/login`);
  console.log('请求数据:', {
    username: data.username,
    passwordLength: data.password.length,
    login_type: data.login_type || 'password'
  });

  try {
    console.log('发起 Taro.request...');
    const requestData = {
      username: data.username,
      password: data.password,
      login_type: data.login_type || 'password' // 默认使用密码登录
    };

    const requestConfig = {
      url: `${API_BASE_URL}/api/login`,
      method: 'POST' as const,
      header: {
        'Content-Type': 'application/json'
      },
      data: requestData
    };
    console.log('请求配置:', {
      ...requestConfig,
      data: { ...requestConfig.data, password: '***' }
    });

    const response = await Taro.request(requestConfig);

    console.log('Taro.request 响应:');
    console.log('- statusCode:', response.statusCode);
    console.log('- header:', response.header);
    console.log('- data:', response.data);
    console.log('- 完整响应:', response);

    const authResponse = response.data as AuthResponse;
    console.log('解析后的 AuthResponse:', authResponse);

    // 如果登录成功，保存 token 和 sid
    if (authResponse.code === 0 && authResponse.data) {
      console.log('✅ 登录成功，保存 token 和 sid');
      console.log('Token:', authResponse.data.token?.substring(0, 20) + '...');
      console.log('SID:', authResponse.data.sid?.substring(0, 20) + '...');
      console.log('过期时间:', authResponse.data.expires_at);

      saveTokens({
        token: authResponse.data.token || '',
        sid: authResponse.data.sid || '',
        expires_at: authResponse.data.expires_at || ''
      });

      // 验证存储
      const savedToken = getToken();
      const savedSid = getSid();
      console.log('验证存储 - Token 已保存:', !!savedToken);
      console.log('验证存储 - SID 已保存:', !!savedSid);
    } else {
      console.log('❌ 登录失败 - 服务器返回错误');
      console.log('错误码:', authResponse.code);
      console.log('错误消息:', authResponse.message);
    }

    console.log('=== Auth Service: 登录 API 调用结束 ===');
    return authResponse;
  } catch (error) {
    console.error('=== Auth Service: 登录 API 异常 ===');
    console.error('错误对象:', error);
    console.error('错误属性:', {
      errMsg: (error as any).errMsg,
      message: (error as any).message,
      stack: (error as any).stack
    });
    throw error;
  }
};

/**
 * 自动登录
 */
export const autoLogin = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}/auth/auto-login`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        token: token
      }
    });

    const authResponse = response.data as AuthResponse;

    // 如果自动登录成功，更新 sid
    if (authResponse.code === 0 && authResponse.data) {
      saveSid(authResponse.data.sid || '');
    }

    return authResponse;
  } catch (error) {
    console.error('自动登录失败:', error);
    throw error;
  }
};

/**
 * 保存 token 和 sid
 */
export const saveTokens = (tokenData: TokenData): void => {
  console.log('=== 保存 Token 和 SID ===');
  console.log('Token:', tokenData.token?.substring(0, 20) + '...');
  console.log('SID:', tokenData.sid?.substring(0, 20) + '...');
  console.log('过期时间:', tokenData.expires_at);

  try {
    Taro.setStorageSync(STORAGE_KEYS.TOKEN, tokenData.token);
    console.log('✅ Token 已保存');

    Taro.setStorageSync(STORAGE_KEYS.SID, tokenData.sid);
    console.log('✅ SID 已保存');

    Taro.setStorageSync(STORAGE_KEYS.EXPIRES, tokenData.expires_at);
    console.log('✅ 过期时间已保存');
  } catch (error) {
    console.error('❌ 保存 token 失败:', error);
  }
};

/**
 * 保存 sid（用于自动登录后更新）
 */
export const saveSid = (sid: string): void => {
  try {
    Taro.setStorageSync(STORAGE_KEYS.SID, sid);
  } catch (error) {
    console.error('保存 sid 失败:', error);
  }
};

/**
 * 获取 token
 */
export const getToken = (): string => {
  try {
    return Taro.getStorageSync(STORAGE_KEYS.TOKEN) || '';
  } catch (error) {
    console.error('获取 token 失败:', error);
    return '';
  }
};

/**
 * 获取 sid
 */
export const getSid = (): string => {
  try {
    return Taro.getStorageSync(STORAGE_KEYS.SID) || '';
  } catch (error) {
    console.error('获取 sid 失败:', error);
    return '';
  }
};

/**
 * 获取过期时间
 */
export const getExpiresAt = (): string => {
  try {
    return Taro.getStorageSync(STORAGE_KEYS.EXPIRES) || '';
  } catch (error) {
    console.error('获取过期时间失败:', error);
    return '';
  }
};

/**
 * 检查 token 是否存在
 */
export const hasToken = (): boolean => {
  const token = getToken();
  return !!token && token.length > 0;
};

/**
 * 清除所有认证信息
 */
export const clearTokens = (): void => {
  try {
    Taro.removeStorageSync(STORAGE_KEYS.TOKEN);
    Taro.removeStorageSync(STORAGE_KEYS.SID);
    Taro.removeStorageSync(STORAGE_KEYS.EXPIRES);
  } catch (error) {
    console.error('清除 token 失败:', error);
  }
};

/**
 * 检查 token 是否过期
 */
export const isTokenExpired = (): boolean => {
  try {
    const expiresAt = getExpiresAt();
    if (!expiresAt) return true;

    const expiresTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();

    return currentTime >= expiresTime;
  } catch (error) {
    console.error('检查 token 过期失败:', error);
    return true;
  }
};

export default {
  register,
  login,
  autoLogin,
  saveTokens,
  saveSid,
  getToken,
  getSid,
  getExpiresAt,
  hasToken,
  clearTokens,
  isTokenExpired
};
