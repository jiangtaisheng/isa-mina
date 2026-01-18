/**
 * 认证相关类型定义
 */

// 认证响应
export interface AuthResponse {
  code: number;
  message: string;
  data?: {
    user_id?: number;
    expires_at?: string;
    sid?: string;
    token?: string;
  };
}

// 登录请求数据
export interface LoginRequest {
  username: string;
  password: string;
  login_type?: string; // 登录类型，可选字段
}

// 注册请求数据
export interface RegisterRequest {
  username: string;
  password: string;
}

// 自动登录请求数据
export interface AutoLoginRequest {
  token: string;
}

// Token 存储结构
export interface TokenData {
  token: string;
  sid: string;
  expires_at: string;
}
