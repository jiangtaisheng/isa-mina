# 技术设计文档: TabBar 底部导航栏

## Context

### 背景
为小程序添加底部 TabBar 导航栏，实现主要功能模块的快速切换。TabBar 包含4个页面：首页、任务、工具、我的。

### 约束条件
- 微信小程序 TabBar 最少2个、最多5个 tab
- TabBar 图标大小限制 81px * 81px，建议使用 PNG 格式
- TabBar 页面必须在 pages 数组的前面位置
- 图标需要提供默认态和选中态两种状态

### 利益相关者
- 开发团队
- 产品团队
- UI 设计团队 

## Goals / Non-Goals

### Goals
- 实现4个 TabBar 页面的基础结构
- 配置 TabBar 图标和文案
- 确保 TabBar 样式统一美观
- 支持默认态和选中态图标切换

### Non-Goals
- 不在本阶段实现各页面的具体业务功能
- 不实现自定义 TabBar 组件（使用原生 TabBar）
- 不实现动态 TabBar（隐藏/显示）

## Decisions

### Decision 1: TabBar 页面结构

**选择**: 4个独立页面目录

| Tab | 页面路径 | 图标名称 | 文案 |
|-----|---------|---------|------|
| 首页 | `pages/index/index` | home | 首页 |
| 任务 | `pages/task/index` | task | 任务 |
| 工具 | `pages/tools/index` | tools | 工具 |
| 我的 | `pages/mine/index` | mine | 我的 |

**原因**:
- 清晰的页面结构
- 便于后续功能扩展
- 符合小程序开发规范

### Decision 2: 图标方案

**选择**: 使用 SVG 转 PNG 图标

**规格**:
- 尺寸: 81px * 81px (2倍图)
- 格式: PNG (支持透明背景)
- 颜色方案:
  - 默认态: `#999999` (灰色)
  - 选中态: `#1890ff` (主题蓝)

**图标存放位置**: `src/assets/tabbar/`

```
src/assets/tabbar/
├── home.png          # 首页-默认
├── home-active.png   # 首页-选中
├── task.png          # 任务-默认
├── task-active.png   # 任务-选中
├── tools.png         # 工具-默认
├── tools-active.png  # 工具-选中
├── mine.png          # 我的-默认
└── mine-active.png   # 我的-选中
```

**备选方案**:
- 使用 IconFont 字体图标: 需要额外配置，增加复杂度
- 使用 Base64 内嵌: 会增加配置文件大小

### Decision 3: TabBar 样式配置

**选择**: 采用简洁现代风格

```typescript
tabBar: {
  color: '#999999',           // 默认文字颜色
  selectedColor: '#1890ff',   // 选中文字颜色
  backgroundColor: '#ffffff', // 背景色
  borderStyle: 'black',       // 上边框颜色
  list: [...]
}
```

**原因**:
- 白色背景配合蓝色选中态，视觉清晰
- 与主流应用风格一致
- 用户体验友好

### Decision 4: 页面基础模板

每个 TabBar 页面采用统一的基础结构：

```
pages/[name]/
├── index.tsx         # 页面组件
├── index.config.ts   # 页面配置
└── index.scss        # 页面样式
```

## 目录结构设计

```
src/
├── app.config.ts          # 更新：添加 tabBar 配置
├── assets/
│   └── tabbar/            # 新增：TabBar 图标
│       ├── home.png
│       ├── home-active.png
│       ├── task.png
│       ├── task-active.png
│       ├── tools.png
│       ├── tools-active.png
│       ├── mine.png
│       └── mine-active.png
└── pages/
    ├── index/             # 已存在：首页
    ├── task/              # 新增：任务页
    │   ├── index.tsx
    │   ├── index.config.ts
    │   └── index.scss
    ├── tools/             # 新增：工具页
    │   ├── index.tsx
    │   ├── index.config.ts
    │   └── index.scss
    └── mine/              # 新增：我的页
        ├── index.tsx
        ├── index.config.ts
        └── index.scss
```

## app.config.ts 配置示例

```typescript
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/task/index',
    'pages/tools/index',
    'pages/mine/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'isa-mina',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/task/index',
        text: '任务',
        iconPath: 'assets/tabbar/task.png',
        selectedIconPath: 'assets/tabbar/task-active.png'
      },
      {
        pagePath: 'pages/tools/index',
        text: '工具',
        iconPath: 'assets/tabbar/tools.png',
        selectedIconPath: 'assets/tabbar/tools-active.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/tabbar/mine.png',
        selectedIconPath: 'assets/tabbar/mine-active.png'
      }
    ]
  }
})
```

## Risks / Trade-offs

### Risk 1: 图标资源缺失
**风险**: 如果图标未正确加载，TabBar 会显示异常
**缓解措施**:
- 确保图标路径正确
- 图标文件格式为 PNG
- 构建时验证资源完整性

### Risk 2: 页面注册顺序
**风险**: TabBar 页面必须在 pages 数组前面，否则可能导致问题
**缓解措施**:
- 将4个 TabBar 页面放在 pages 数组最前面
- 代码审查时检查页面顺序

### Risk 3: 图标尺寸不一致
**风险**: 不同尺寸的图标会影响显示效果
**缓解措施**:
- 统一使用 81px * 81px 尺寸
- 使用图标生成工具确保一致性

## Migration Plan

### 步骤
1. 创建 `src/assets/tabbar/` 目录
2. 添加8个 TabBar 图标文件
3. 创建3个新页面目录（task、tools、mine）
4. 更新 `app.config.ts` 添加 tabBar 配置
5. 构建并验证 TabBar 功能

### 回滚方案
- 删除 tabBar 配置即可恢复原状
- 保留页面文件不影响应用运行

## Open Questions

1. 是否需要自定义 TabBar 组件实现更复杂的交互效果？
2. 图标设计是否需要 UI 团队提供专业设计稿？
3. 是否需要支持 TabBar 徽标（红点/数字）提示？
