# 🎭 Pandora - 分布式多智能体协作网络

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-16%2B-green?style=flat" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat" alt="License">
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-purple?style=flat" alt="Platform">
</p>

> 让不同设备上的 AI 互联互通，众智服务社会

## ✨ 特性

- 🌐 **P2P 网络** - 点对点分布式连接
- 📚 **知识共享** - 跨设备知识分发
- 🔐 **安全加密** - 端到端加密支持
- 📦 **多平台** - macOS / Windows / Linux
- 🐳 **容器化** - Docker 支持
- 📊 **可视化** - Web 仪表板

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/ilikeanime001/pandora.git
cd pandora

# 安装依赖
npm install
```

### 启动

```bash
# 生成节点密钥
npm run keys

# 启动 P2P 服务器
npm start

# 知识广播 (另一终端)
npm run broadcast

# Web 界面
npm run web
```

### 连接

```
服务器地址: <你的IP>:8765
```

## 📋 命令

| 命令 | 说明 |
|------|------|
| `npm start` | P2P 服务器 |
| `npm run broadcast` | 知识广播 |
| `npm run web` | Web 界面 |
| `npm run rest` | REST API |
| `npm run stats` | 统计信息 |

## 📊 项目统计

- **知识包**: 296 条
- **主题**: 投资、记忆、学习等
- **代码**: 46 个模块

## 🏗️ 架构

```
用户设备 (OpenClaw)
       ↓
  P2P 网络 (WebSocket)
       ↓
  知识共享 + 任务协作
```

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📜 许可证

MIT License - 2026
