/**
 * 认证状态管理
 * 使用 React hooks 和 Taro storage 管理认证状态
 */

import { useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import * as authService from '../services/auth';
import { LoginRequest, RegisterRequest } from '../types/auth';

/**
 * 认证状态接口
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: {
    id?: number;
    username?: string;
  } | null;
}

/**
 * 使用认证状态的 Hook
 */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: authService.hasToken(),
    isLoading: false,
    error: null,
    user: null
  });

  /**
   * 更新认证状态
   */
  const updateState = (updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  /**
   * 登录 action
   */
  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    console.log('=== Store: 登录开始 ===');
    console.log('登录凭据:', { username: credentials.username, passwordLength: credentials.password.length });

    try {
      updateState({ isLoading: true, error: null });
      console.log('正在调用 authService.login...');

      const response = await authService.login(credentials);
      console.log('authService.login 响应:', response);

      if (response.code === 0) {
        console.log('✅ Store: 登录成功');
        updateState({
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        console.log('❌ Store: 登录失败 - 服务器返回错误码:', response.code);
        updateState({
          isAuthenticated: false,
          isLoading: false,
          error: response.message || '登录失败'
        });
        return false;
      }
    } catch (error: any) {
      console.error('❌ Store: 登录异常:', error);
      console.error('错误详情:', {
        message: error.message,
        stack: error.stack,
        errMsg: error.errMsg
      });
      updateState({
        isAuthenticated: false,
        isLoading: false,
        error: error.message || '登录失败，请检查网络连接'
      });
      return false;
    }
  }, []);

  /**
   * 注册 action
   */
  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    try {
      updateState({ isLoading: true, error: null });

      const response = await authService.register(data);

      if (response.code === 0) {
        updateState({
          isLoading: false,
          error: null
        });
        return true;
      } else {
        updateState({
          isLoading: false,
          error: response.message || '注册失败'
        });
        return false;
      }
    } catch (error: any) {
      updateState({
        isLoading: false,
        error: error.message || '注册失败，请检查网络连接'
      });
      return false;
    }
  }, []);

  /**
   * 自动登录 action
   */
  const autoLogin = useCallback(async (): Promise<boolean> => {
    try {
      updateState({ isLoading: true, error: null });

      const token = authService.getToken();

      if (!token) {
        updateState({
          isAuthenticated: false,
          isLoading: false,
          error: '未找到登录凭证'
        });
        return false;
      }

      const response = await authService.autoLogin(token);

      if (response.code === 0) {
        updateState({
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        updateState({
          isAuthenticated: false,
          isLoading: false,
          error: response.message || '自动登录失败'
        });
        return false;
      }
    } catch (error: any) {
      updateState({
        isAuthenticated: false,
        isLoading: false,
        error: error.message || '自动登录失败，请重新登录'
      });
      return false;
    }
  }, []);

  /**
   * 登出 action
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      updateState({ isLoading: true });

      // 清除 token
      authService.clearTokens();

      // 重置状态
      updateState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        user: null
      });

      // 跳转到登录页
      Taro.reLaunch({
        url: '/pages/login/index'
      });
    } catch (error: any) {
      updateState({
        isLoading: false,
        error: error.message || '登出失败'
      });
    }
  }, []);

  /**
   * 清除错误消息
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, []);

  return {
    // 状态
    ...state,

    // 方法
    login,
    register,
    autoLogin,
    logout,
    clearError,

    // 工具方法
    hasToken: authService.hasToken,
    getToken: authService.getToken,
    getSid: authService.getSid,
    isTokenExpired: authService.isTokenExpired
  };
};

export default useAuth;
