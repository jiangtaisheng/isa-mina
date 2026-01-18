/**
 * 注册页面
 */

import { useState } from 'react';
import { View, Input, Button, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAuth } from '../../store/auth';
import './index.scss';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterPage = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: ''
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
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母和数字';
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码长度至少为 8 个字符';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = '密码必须包含字母和数字';
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请再次输入密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理输入变化
   */
  const handleInputChange = (field: keyof FormData, value: string) => {
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
    // 验证表单
    if (!validateForm()) {
      return;
    }

    // 调用注册
    const success = await register({
      username: formData.username.trim(),
      password: formData.password
    });

    if (success) {
      // 显示成功提示
      Taro.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 2000
      });

      // 延迟跳转到登录页
      setTimeout(() => {
        Taro.navigateTo({
          url: '/pages/login/index'
        });
      }, 1000);
    }
  };

  /**
   * 跳转到登录页面
   */
  const handleNavigateToLogin = () => {
    Taro.navigateBack();
  };

  return (
    <View className="register-page">
      <View className="register-card">
        {/* 标题 */}
        <View className="register-header">
          <Text className="register-title">创建账户</Text>
          <Text className="register-subtitle">注册您的账户</Text>
        </View>

        {/* 表单 */}
        <View className="register-form">
          {/* 用户名输入框 */}
          <View className="form-item">
            <Input
              className="form-input"
              type="text"
              placeholder="请输入用户名（3-20个字符）"
              value={formData.username}
              onInput={(e) => handleInputChange('username', e.detail.value)}
              placeholderClass="form-input-placeholder"
              maxlength={20}
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
              placeholder="请输入密码（至少8位，包含字母和数字）"
              value={formData.password}
              onInput={(e) => handleInputChange('password', e.detail.value)}
              placeholderClass="form-input-placeholder"
            />
            {errors.password && (
              <Text className="form-error">{errors.password}</Text>
            )}
          </View>

          {/* 确认密码输入框 */}
          <View className="form-item">
            <Input
              className="form-input"
              type="password"
              placeholder="请再次输入密码"
              value={formData.confirmPassword}
              onInput={(e) => handleInputChange('confirmPassword', e.detail.value)}
              placeholderClass="form-input-placeholder"
            />
            {errors.confirmPassword && (
              <Text className="form-error">{errors.confirmPassword}</Text>
            )}
          </View>

          {/* 全局错误提示 */}
          {error && (
            <View className="error-message">
              <Text>{error}</Text>
            </View>
          )}

          {/* 注册按钮 */}
          <Button
            className="register-button"
            type="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '注册中...' : '注册'}
          </Button>

          {/* 跳转到登录页面 */}
          <View className="login-link">
            <Text>已有账户？</Text>
            <Text className="link-text" onClick={handleNavigateToLogin}>
              立即登录
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RegisterPage;
