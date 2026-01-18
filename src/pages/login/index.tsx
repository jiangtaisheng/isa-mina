/**
 * 登录页面
 */

import { useState } from 'react';
import { View, Input, Button, Text, Form } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAuth } from '../../store/auth';
import './index.scss';

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证用户名
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = '用户名长度应在 3-20 个字符之间';
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码长度至少为 8 个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理输入变化
   */
  const handleInputChange = (field: keyof FormData, value: string) => {
    console.log(`[输入变化] ${field}:`, field === 'password' ? `***(${value.length}字符)` : value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // 清除全局错误
    if (error) {
      clearError();
    }
  };

  /**
   * 处理提交
   */
  const handleSubmit = async () => {
    console.log('=== 登录页面提交开始 ===');
    console.log('表单数据:', {
      username: formData.username.trim(),
      passwordLength: formData.password.length
    });

    // 验证表单
    if (!validateForm()) {
      console.log('❌ 表单验证失败:', errors);
      return;
    }

    console.log('✅ 表单验证通过');

    // 调用登录
    const success = await login({
      username: formData.username.trim(),
      password: formData.password,
      login_type: "password"
    });

    console.log('登录结果:', success);

    if (success) {
      console.log('✅ 登录成功，准备跳转');
      // 显示成功提示
      Taro.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000
      });

      // 延迟跳转到主页
      setTimeout(() => {
        Taro.switchTab({
          url: '/pages/tools/index'
        });
      }, 1000);
    } else {
      console.log('❌ 登录失败');
    }
  };

  /**
   * 跳转到注册页面
   */
  const handleNavigateToRegister = () => {
    Taro.navigateTo({
      url: '/pages/register/index'
    });
  };

  return (
    <View className="login-page">
      <View className="login-card">
        {/* 标题 */}
        <View className="login-header">
          <Text className="login-title">欢迎回来</Text>
          <Text className="login-subtitle">登录您的账户</Text>
        </View>

        {/* 表单 */}
        <View className="login-form">
          {/* 用户名输入框 */}
          <View className="form-item">
            <Input
              className="form-input"
              type="text"
              placeholder="请输入用户名"
              value={formData.username}
              onInput={(e) => handleInputChange('username', e.detail.value)}
              placeholderClass="form-input-placeholder"
            />
            {errors.username && (
              <Text className="form-error">{errors.username}</Text>
            )}
          </View>

          {/* 密码输入框 */}
          <View className="form-item">
            <Input
              className="form-input"
              type="password"
              placeholder="请输入密码"
              value={formData.password}
              onInput={(e) => handleInputChange('password', e.detail.value)}
              placeholderClass="form-input-placeholder"
            />
            {errors.password && (
              <Text className="form-error">{errors.password}</Text>
            )}
          </View>

          {/* 全局错误提示 */}
          {error && (
            <View className="error-message">
              <Text>{error}</Text>
            </View>
          )}

          {/* 登录按钮 */}
          <Button
            className="login-button"
            type="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </Button>

          {/* 跳转到注册页面 */}
          <View className="register-link">
            <Text>还没有账户？</Text>
            <Text className="link-text" onClick={handleNavigateToRegister}>
              立即注册
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginPage;
