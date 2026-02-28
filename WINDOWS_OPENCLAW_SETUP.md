# Windows OpenClaw 安装指南 | OpenClaw on Windows Setup

> 在 Windows 上安装 OpenClaw | Install OpenClaw on Windows

---

## 📋 目录

1. [准备工作](#1-准备工作)
2. [安装 OpenClaw](#2-安装-openclaw)
3. [配置](#3-配置)
4. [连接 DoudouNet](#4-连接-doudounet)
5. [启动](#5-启动)

---

## 1. 准备工作 | Preparation

### 需要

- ✅ Windows 10/11
- ✅ 管理员权限
- ✅ 网络连接

### 安装必要软件

1. **Node.js** (必须)
   
   下载: https://nodejs.org/ (LTS)
   
   验证: `node --version`

2. **Git** (推荐)
   
   下载: https://git-scm.com/
   
   验证: `git --version`

---

## 2. 安装 OpenClaw | Install OpenClaw

### 方法 A: 使用 npm (推荐)

```powershell
# 安装 OpenClaw 全局
npm install -g openclaw

# 验证安装
openclaw --version
```

### 方法 B: 从源码安装

```powershell
# 克隆仓库
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 安装依赖
npm install

# 启动
npm start
```

---

## 3. 配置 | Configuration

### 3.1 初始化

```powershell
openclaw init
```

这会创建配置目录：`%APPDATA%/openclaw/`

### 3.2 配置 WhatsApp (可选)

获取 WhatsApp 连接：
- 参考 Mac 端的配置
- 或者用 QR 码登录

### 3.3 配置网络

在 `%APPDATA%/openclaw/config/default.json` 中：

```json
{
  "network": {
    "host": "0.0.0.0",
    "port": 8765
  },
  "discovery": {
    "enabled": true,
    "multicast": true
  }
}
```

---

## 4. 连接 DoudouNet | Connect to DoudouNet

### 4.1 克隆 DoudouNet

```powershell
mkdir C:\OpenClaw
cd C:\OpenClaw
git clone https://github.com/ilikeanime001-jpg/doudou-net.git
cd doudou-net
npm install
```

### 4.2 配置 DoudouNet

创建 `config/node_info.json`：

```json
{
  "node_id": "你的唯一ID",
  "name": "Windows-你的名字",
  "ip": "192.168.1.95",
  "capabilities": ["task", "knowledge", "ai"],
  "openclaw_url": "http://localhost:8080"
}
```

---

## 5. 启动 | Start

### 5.1 启动 OpenClaw

```powershell
# 终端 1: 启动 OpenClaw
openclaw start
```

### 5.2 启动 DoudouNet 客户端

```powershell
# 终端 2: 连接 Mac
cd C:\OpenClaw\doudou-net
node src\client.js ws://192.168.1.156:8765
```

---

## ✅ 完成后状态

| 功能 | 状态 |
|------|------|
| OpenClaw AI | ✅ Windows 上有自己的 AI |
| WhatsApp/Signal | ✅ (可选) |
| DoudouNet 连接 | ✅ 与 Mac 协作 |
| 任务执行 | ✅ 本地 AI 执行 |

---

## 📝 常见问题

### 问题: 端口被占用

```powershell
# 查看端口占用
netstat -ano | findstr 8765

# 杀掉进程
taskkill /PID <PID> /F
```

### 问题: npm 安装失败

以管理员身份运行 PowerShell：
```powershell
npm install -g openclaw --force
```

---

## 🎉 成功！

安装完成后，你的 Windows 就有：
- 🤖 OpenClaw AI 助手
- 🌐 DoudouNet 协作网络
- 📱 消息通道 (可选)

---

*有问题随时问我！*
