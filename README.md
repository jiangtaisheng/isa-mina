# isa-mina 微信小程序

基于 Taro + React + TypeScript 开发的微信小程序项目。

## 技术栈

- **框架**: Taro 4.1.9
- **UI 框架**: React 18
- **开发语言**: TypeScript
- **样式**: SCSS
- **构建工具**: Webpack 5

## 环境要求

- Node.js >= 18.x
- npm >= 9.x
- 微信开发者工具

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 微信小程序
npm run dev:weapp

# H5
npm run dev:h5
```

### 生产构建

```bash
# 微信小程序
npm run build:weapp

# H5
npm run build:h5
```

### 代码检查

```bash
# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix
```

## 项目结构

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
│   │   └── index/         # 首页
│   ├── components/        # 公共组件
│   ├── services/          # API 服务层
│   ├── utils/             # 工具函数
│   ├── assets/            # 静态资源
│   └── types/             # TypeScript 类型定义
├── dist/                  # 构建输出目录
├── project.config.json    # 微信小程序项目配置
├── tsconfig.json          # TypeScript 配置
├── babel.config.js        # Babel 配置
└── package.json
```

## 微信小程序配置

- **AppID**: `wx85a973c90daf0984`
- 使用微信开发者工具打开 `dist` 目录进行预览和调试

## 开发指南

1. 在 `src/pages/` 下创建新页面
2. 在 `src/app.config.ts` 中注册页面路由
3. 运行 `npm run dev:weapp` 进行开发
4. 使用微信开发者工具预览效果

## 相关文档

- [Taro 官方文档](https://docs.taro.zone/)
- [React 官方文档](https://react.dev/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
