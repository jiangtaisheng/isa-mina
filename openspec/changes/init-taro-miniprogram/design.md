# 技术设计文档: Taro + React 微信小程序

## Context

### 背景
本项目需要开发一个微信小程序，使用 Taro 框架结合 React 进行开发。Taro 是京东开源的多端统一开发框架，支持使用 React/Vue 等框架来开发微信/百度/支付宝等多端小程序及 H5 应用。

### 约束条件
- 微信小程序 AppID: `wx85a973c90daf0984`
- 必须使用 Taro 框架
- 必须使用 React 作为 UI 框架
- 需要兼容微信小程序平台规范

### 利益相关者
- 开发团队
- 产品团队
- 最终用户

## Goals / Non-Goals

### Goals
- 搭建完整的 Taro + React 项目工程
- 配置正确的微信小程序 AppID
- 建立清晰的项目目录结构
- 配置开发环境和构建流程
- 支持 TypeScript 开发（推荐）
- 配置代码规范工具（ESLint、Prettier）

### Non-Goals
- 不在本阶段实现具体业务功能
- 不进行多端适配（仅针对微信小程序）
- 不集成复杂的状态管理库（后续根据需要添加）

## Decisions

### Decision 1: 使用 Taro 3.x 版本
**选择**: Taro 3.x (最新稳定版)

**原因**:
- Taro 3.x 采用了全新的架构，性能更优
- 支持更完善的 React Hooks
- 社区活跃，文档完善
- 支持更多的小程序原生能力

**备选方案**:
- Taro 2.x: 较旧，不推荐新项目使用
- 原生微信小程序开发: 缺乏组件化和工程化能力
- uni-app: 使用 Vue 语法，不符合 React 要求

### Decision 2: 使用 TypeScript
**选择**: TypeScript

**原因**:
- 更好的类型安全
- 更好的 IDE 支持和代码提示
- 便于大型项目维护
- Taro 官方推荐

**备选方案**:
- JavaScript: 缺乏类型检查，不利于项目维护

### Decision 3: 样式方案使用 SCSS/Less
**选择**: SCSS

**原因**:
- 支持变量、嵌套等高级特性
- 与 React 生态系统兼容良好
- Taro 内置支持

**备选方案**:
- Less: 也是不错的选择
- CSS Modules: 可作为补充方案
- Tailwind CSS: 可能增加包体积

### Decision 4: 项目结构设计
```
isa-mina/
├── config/                 # Taro 配置文件
│   ├── index.ts           # 主配置
│   ├── dev.ts             # 开发环境配置
│   └── prod.ts            # 生产环境配置
├── src/
│   ├── app.ts             # 应用入口
│   ├── app.config.ts      # 全局配置
│   ├── app.scss           # 全局样式
│   ├── pages/             # 页面目录
│   │   └── index/
│   │       ├── index.tsx
│   │       ├── index.config.ts
│   │       └── index.scss
│   ├── components/        # 公共组件
│   ├── services/          # API 服务层
│   ├── stores/            # 状态管理（可选）
│   ├── utils/             # 工具函数
│   ├── assets/            # 静态资源
│   └── types/             # TypeScript 类型定义
├── project.config.json    # 微信小程序项目配置
├── package.json
├── tsconfig.json
└── babel.config.js
```

## Risks / Trade-offs

### Risk 1: Taro 框架学习成本
**风险**: 团队成员可能需要时间熟悉 Taro 框架
**缓解措施**:
- 准备 Taro 开发指南文档
- 使用 Taro 官方文档和示例
- 前期安排学习时间

### Risk 2: 小程序包体积限制
**风险**: 微信小程序主包限制 2MB
**缓解措施**:
- 使用分包加载
- 按需引入组件和库
- 压缩图片资源
- 开启代码压缩

### Risk 3: 小程序与 React 差异
**风险**: 部分 React 特性在小程序中受限
**缓解措施**:
- 遵循 Taro 开发规范
- 使用 Taro 提供的 API 替代
- 提前了解限制避免踩坑

## Migration Plan

### 步骤
1. 安装 Node.js 环境 (推荐 v18+)
2. 全局安装 Taro CLI: `npm install -g @tarojs/cli`
3. 使用 Taro CLI 初始化项目
4. 配置微信小程序 AppID
5. 安装项目依赖
6. 配置开发工具（微信开发者工具）
7. 运行开发环境验证

### 回滚方案
- 如果 Taro 3.x 出现问题，可以降级到稳定的 Taro 2.x
- 保留初始化配置备份

## Open Questions

1. 是否需要集成状态管理库（如 Redux、MobX、Zustand）？
2. 是否需要集成 UI 组件库（如 Taro UI、NutUI）？
3. 是否需要配置 CI/CD 流程？
4. 小程序的具体功能需求是什么？

## 技术栈总结

| 技术 | 版本 | 用途 |
|------|------|------|
| Taro | 3.x | 跨端框架 |
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 开发语言 |
| SCSS | - | 样式预处理 |
| ESLint | - | 代码检查 |
| Prettier | - | 代码格式化 |
