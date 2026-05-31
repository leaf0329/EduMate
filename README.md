# EduMate — AI学习助手

基于 Uniapp 的跨平台 AI 学习助手移动应用。

## 技术栈

Uniapp + Vue3 (Options API) + 本地 Storage + 硅基流动 API (DeepSeek-V3.2)

## 功能

- 用户登录/注册
- 学习计划管理（CRUD + 超时检测）
- 学习笔记管理（CRUD + 关键词搜索）
- AI 智能问答（模拟流式输出）
- 每日打卡
- 学习统计（数据卡片 + 柱状图）
- 个人中心

## 项目结构

pages/ # 页面
login/ # 登录注册
home/ # 首页
plan/ # 学习计划
notes/ # 学习笔记
ai/ # AI问答
stats/ # 学习统计
profile/ # 个人中心
components/ # 通用组件
utils/ # 工具层（存储、请求、配置、日期）
static/ # 静态资源

## 运行方式

使用 HBuilderX 打开项目，运行到浏览器、手机或微信开发者工具即可。

## 关于api配置

可在utils/config.js中更改api供应商与api密钥
