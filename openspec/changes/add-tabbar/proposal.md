# Change: 添加 TabBar 底部导航栏

## Why
小程序需要底部导航栏来实现主要功能模块的快速切换，提升用户体验和应用的可用性。TabBar 是小程序最常见的导航模式，可以让用户快速访问核心功能页面。

## What Changes
- 新增4个 TabBar 页面：首页、任务、工具、我的
- 配置 TabBar 图标（默认态和选中态）
- 配置 TabBar 文案和样式
- 更新 `app.config.ts` 添加 tabBar 配置

## Impact
- Affected specs: `tabbar` (新增)
- Affected code:
  - `src/app.config.ts` - 添加 tabBar 配置
  - `src/pages/` - 新增4个页面目录
  - `src/assets/` - 新增 tabBar 图标资源
