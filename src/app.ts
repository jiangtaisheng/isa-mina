import { PropsWithChildren, useEffect } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.scss'
import * as authService from './services/auth'

function App({ children }: PropsWithChildren<any>) {
  /**
   * 应用启动时的认证检查
   */
  useLaunch(() => {
    console.log('应用启动，检查认证状态...')

    // 检查是否存在 token
    if (authService.hasToken()) {
      console.log('发现 token，尝试自动登录...')

      // 调用自动登录
      authService.autoLogin(authService.getToken())
        .then((response) => {
          if (response.code === 0) {
            console.log('自动登录成功')
            // 自动登录成功，保持在当前页面或跳转到主页
            // 由于是小程序启动，不需要额外操作
          } else {
            console.log('自动登录失败:', response.message)
            // 自动登录失败，清除 token，显示登录页
            authService.clearTokens()
          }
        })
        .catch((error) => {
          console.error('自动登录失败:', error)
          // 网络错误或其他错误，保留 token 以便下次重试
          // 或者根据需要清除 token 并显示登录页
        })
    } else {
      console.log('未发现 token，显示登录页')
      // 没有 token，可以在这里重定向到登录页
      // 但由于小程序启动页面配置，通常在 app.config.ts 中设置
    }
  })

  return children
}

export default App
