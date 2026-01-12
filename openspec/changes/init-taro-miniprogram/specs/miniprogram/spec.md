## ADDED Requirements

### Requirement: 项目工程初始化
系统 SHALL 提供一个基于 Taro 3.x 和 React 18.x 的微信小程序项目工程。

#### Scenario: 项目创建成功
- **WHEN** 开发者使用 Taro CLI 初始化项目
- **THEN** 生成符合 Taro 规范的项目结构
- **AND** 包含必要的配置文件（tsconfig.json, babel.config.js 等）

#### Scenario: 开发环境运行
- **WHEN** 开发者运行 `npm run dev:weapp` 命令
- **THEN** 成功编译项目到 `dist` 目录
- **AND** 支持热更新功能

### Requirement: 微信小程序配置
系统 SHALL 正确配置微信小程序的 AppID 和基础设置。

#### Scenario: AppID 配置正确
- **WHEN** 使用微信开发者工具打开项目
- **THEN** 项目配置的 AppID 为 `wx85a973c90daf0984`
- **AND** 可以正常预览和调试

#### Scenario: 页面配置正确
- **WHEN** 小程序启动
- **THEN** 正确加载首页（pages/index/index）
- **AND** 导航栏和窗口样式符合配置

### Requirement: TypeScript 支持
系统 SHALL 完整支持 TypeScript 开发。

#### Scenario: TypeScript 编译正常
- **WHEN** 开发者编写 TypeScript 代码
- **THEN** 代码可以正常编译
- **AND** 类型检查正常工作

#### Scenario: 类型定义完整
- **WHEN** 使用 Taro API 或 React Hooks
- **THEN** IDE 提供完整的类型提示
- **AND** 类型错误可以被检测

### Requirement: 项目目录结构
系统 SHALL 提供清晰、可扩展的目录结构。

#### Scenario: 标准目录存在
- **WHEN** 查看项目 src 目录
- **THEN** 包含 pages、components、services、utils、assets、types 目录
- **AND** 每个目录职责清晰

#### Scenario: 配置文件完整
- **WHEN** 查看项目根目录
- **THEN** 包含 config 目录存放 Taro 配置
- **AND** 包含 project.config.json 微信小程序配置

### Requirement: 代码规范工具
系统 SHALL 集成代码规范检查和格式化工具。

#### Scenario: ESLint 检查
- **WHEN** 代码不符合规范
- **THEN** ESLint 报告错误或警告
- **AND** 可以通过命令自动修复

#### Scenario: Prettier 格式化
- **WHEN** 保存代码文件
- **THEN** 代码按照配置的规则格式化
- **AND** 团队代码风格统一
