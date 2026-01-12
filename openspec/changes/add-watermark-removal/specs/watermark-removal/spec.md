## ADDED Requirements

### Requirement: URL 解析去水印
系统 SHALL 支持解析短视频平台链接，获取无水印视频/图片资源。

#### Scenario: 解析抖音链接
- **WHEN** 用户输入抖音分享链接（v.douyin.com 或 www.douyin.com）
- **THEN** 系统解析并返回无水印视频地址
- **AND** 显示视频标题、作者、封面信息

#### Scenario: 解析快手链接
- **WHEN** 用户输入快手分享链接（v.kuaishou.com）
- **THEN** 系统解析并返回无水印视频地址
- **AND** 显示视频标题、作者、封面信息

#### Scenario: 解析小红书链接
- **WHEN** 用户输入小红书分享链接（xhslink.com 或 xiaohongshu.com）
- **THEN** 系统解析并返回无水印图片/视频地址
- **AND** 显示笔记标题、作者信息

#### Scenario: 解析失败处理
- **WHEN** 链接无法解析或平台不支持
- **THEN** 系统显示友好的错误提示
- **AND** 提示用户检查链接是否正确

### Requirement: 本地图片去水印
系统 SHALL 支持对本地图片进行水印去除处理。

#### Scenario: 选择图片
- **WHEN** 用户点击"相册去水印"
- **THEN** 调起系统相册选择器
- **AND** 用户可以选择需要处理的图片

#### Scenario: 裁剪水印区域
- **WHEN** 用户选择图片后
- **THEN** 显示图片预览
- **AND** 允许用户选择水印区域进行裁剪

#### Scenario: 处理完成
- **WHEN** 图片处理完成
- **THEN** 显示处理前后对比
- **AND** 提供保存到相册选项

### Requirement: 结果展示页面
系统 SHALL 提供去水印结果的展示页面。

#### Scenario: 视频结果展示
- **WHEN** URL 解析成功返回视频
- **THEN** 显示视频封面和播放按钮
- **AND** 显示视频标题、作者、时长
- **AND** 提供"保存到相册"按钮

#### Scenario: 图片结果展示
- **WHEN** 处理完成返回图片
- **THEN** 显示处理后的图片
- **AND** 提供"保存到相册"按钮
- **AND** 提供"分享"按钮

### Requirement: 保存到相册
系统 SHALL 支持将去水印结果保存到用户相册。

#### Scenario: 保存视频
- **WHEN** 用户点击"保存到相册"（视频）
- **THEN** 下载视频并保存到相册
- **AND** 显示保存进度
- **AND** 保存成功后提示用户

#### Scenario: 保存图片
- **WHEN** 用户点击"保存到相册"（图片）
- **THEN** 保存图片到相册
- **AND** 保存成功后提示用户

#### Scenario: 权限处理
- **WHEN** 用户未授权相册权限
- **THEN** 提示用户授权
- **AND** 引导用户前往设置开启权限

### Requirement: 历史记录功能
系统 SHALL 保存用户的去水印历史记录。

#### Scenario: 记录保存
- **WHEN** 用户成功完成去水印操作
- **THEN** 自动保存到历史记录
- **AND** 记录包含类型、来源、时间、结果等信息

#### Scenario: 查看历史
- **WHEN** 用户进入历史记录页面
- **THEN** 显示历史记录列表
- **AND** 按时间倒序排列
- **AND** 支持点击查看详情

#### Scenario: 删除记录
- **WHEN** 用户长按或滑动某条记录
- **THEN** 显示删除选项
- **AND** 确认后删除该记录

#### Scenario: 记录上限
- **WHEN** 历史记录超过50条
- **THEN** 自动删除最早的记录
- **AND** 保持记录数量在限制内

### Requirement: 处理状态反馈
系统 SHALL 在处理过程中提供清晰的状态反馈。

#### Scenario: 解析中状态
- **WHEN** 正在解析URL
- **THEN** 显示加载动画
- **AND** 显示"正在解析..."提示

#### Scenario: 下载中状态
- **WHEN** 正在下载视频/图片
- **THEN** 显示下载进度条
- **AND** 显示已下载/总大小

#### Scenario: 处理中状态
- **WHEN** 正在处理图片
- **THEN** 显示处理进度
- **AND** 显示"正在处理..."提示

### Requirement: 平台支持
系统 SHALL 支持主流短视频平台的链接解析。

#### Scenario: 支持平台列表
- **WHEN** 查看支持的平台
- **THEN** 包含以下平台：
  - 抖音 (douyin.com)
  - 快手 (kuaishou.com)
  - 小红书 (xiaohongshu.com)
  - 微博 (weibo.com)
  - 皮皮虾 (pipix.com)
  - 西瓜视频 (ixigua.com)

#### Scenario: 平台自动识别
- **WHEN** 用户输入链接
- **THEN** 自动识别所属平台
- **AND** 使用对应的解析器处理
