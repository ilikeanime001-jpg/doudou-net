# Windows 端完整设置指南 | Windows Setup Guide

> 从零开始配置 Windows 协作节点 | From zero to collaborative node

---

## 📋 目录 | Table of Contents

1. [基础环境](#1-基础环境)
2. [安装 Node.js](#2-安装-nodejs)
3. [配置 DoudouNet](#3-配置-doudounet)
4. [安装 Jan.ai](#4-安装-janai)
5. [配置任务执行](#5-配置任务执行)
6. [启动服务](#6-启动服务)
7. [测试连接](#7-测试连接)

---

## 1. 基础环境 | Basic Environment

### 需要的东西 | What You Need

- ✅ Windows 10/11 电脑
- ✅ 局域网连接 (与 Mac 同一 WiFi)
- ✅ 管理员权限 (安装软件用)

---

## 2. 安装 Node.js | Install Node.js

### 步骤 | Steps

1. **下载 Node.js**
   
   打开浏览器访问：
   ```
   https://nodejs.org/
   ```
   
   点击 **LTS 版本** (左侧大按钮)

2. **安装**
   
   双击下载的 `node-v20.x.x-x64.msi`
   
   ⚠️ 安装时勾选：
   - ✅ "Add to PATH" (添加到环境变量)
   - ✅ "Node.js runtime" (运行时)
   - ✅ "npm package manager" (npm包管理器)

3. **验证安装**
   
   打开 **PowerShell** 或 **CMD**，输入：
   ```
   node --version
   npm --version
   ```
   
   应该显示版本号，比如：
   ```
   v20.11.0
   10.2.4
   ```

---

## 3. 配置 DoudouNet | Configure DoudouNet

### 3.1 下载项目

1. 创建文件夹
   
   在 `C:\Users\你的用户名\` 下创建 `DoudouNet` 文件夹

2. 下载代码
   
   方法 A - 从 GitHub 克隆：
   ```powershell
   cd C:\Users\你的用户名\DoudouNet
   git clone https://github.com/ilikeanime001-jpg/doudou-net.git .
   ```
   
   方法 B - 直接下载 ZIP：
   - 打开 https://github.com/ilikeanime001-jpg/doudou-net
   - 点击绿色 **Code** 按钮
   - 点击 **Download ZIP**
   - 解压到 `C:\Users\你的用户名\DoudouNet`

### 3.2 安装依赖

打开 **PowerShell**，运行：
```powershell
cd C:\Users\你的用户名\DoudouNet
npm install
```

等待安装完成...

### 3.3 生成密钥

```powershell
npm run keys
```

这会创建 `config/identity.json` 文件

---

## 4. 安装 Jan.ai | Install Jan.ai

### 4.1 下载 Jan.ai

1. 打开浏览器访问：
   ```
   https://jan.ai/
   ```

2. 点击 **Download for Windows**

3. 运行安装程序

### 4.2 配置 Jan.ai

1. 打开 Jan.ai 应用

2. 点击左下角 **Settings** (齿轮图标)

3. 找到 **Local API Server**

4. **启用** Local API Server

5. **API Key**: 随便输入什么都可以！
   - 例如：`sk-test`
   - 不需要注册，不需要付费
   - 因为 Jan.ai 是本地运行的

6. **确认启动成功**
   
   日志显示：
   ```
   JAN API listening at http://127.0.0.1:1337
   ```

### 4.3 验证 Jan.ai API

测试 API 是否可用：
```powershell
curl http://localhost:1337/v1/models
```

应该返回模型列表。

---

## 5. 配置任务执行 | Configure Task Execution

### 5.1 创建任务处理器配置

在 `C:\Users\你的用户名\DoudouNet\config\` 文件夹下，创建 `jan_config.json`：

```json
{
  "enabled": true,
  "api_url": "http://localhost:1337",
  "api_key": "sk-xxxxxxxxxxxxxxxxxxxxx",
  "model": "mistral-ins-7b-q4"
}
```

⚠️ 把 `sk-xxx` 替换成你真实的 API Key！

### 5.2 安装额外依赖

```powershell
npm install axios
```

---

## 6. 启动服务 | Start Services

### 6.1 启动 P2P 客户端 (连接 Mac)

```powershell
cd C:\Users\你的用户名\DoudouNet
node src\client.js ws://192.168.1.156:8765
```

- `192.168.1.156` 是 Mac 的 IP 地址
- 如果不同，请修改

### 6.2 保持运行

- 保持 PowerShell 窗口打开
- 不要关闭终端

### 6.3 开机自启 (可选)

创建一个快捷方式指向：
```
C:\Windows\System32\cmd.exe /k "cd C:\Users\你的用户名\DoudouNet && node src\client.js ws://192.168.1.156:8765"
```

---

## 7. 测试连接 | Test Connection

### 7.1 在 Mac 上检查

打开终端，运行：
```bash
netstat -an | grep 8765
```

应该看到类似：
```
tcp4  0  0  192.168.1.156.8765  192.168.1.95.60386  ESTABLISHED
```

### 7.2 测试任务分配

在 Mac 上发送测试任务：
```bash
cd ~/.openclaw/workspace/projects/pandora
node -e "
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8765');
ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'TASK_REQUEST',
    payload: { title: '测试任务', description: '请回复：收到' }
  }));
});
"
```

---

## 🔧 故障排除 | Troubleshooting

### 问题 1: node 命令找不到

**解决**：
1. 重启电脑
2. 或者手动添加到 PATH

### 问题 2: 连接不上 Mac

**检查**：
1. 确认 Mac IP 地址正确
2. 确认防火墙允许 8765 端口
3. 确认在同一 WiFi

### 问题 3: Jan.ai 不工作

**解决**：
1. 确认 Jan.ai 正在运行
2. 确认 API Key 正确
3. 尝试重启 Jan.ai

---

## 📝 快速命令汇总 | Quick Command Summary

```powershell
# 1. 安装依赖
npm install

# 2. 生成密钥
npm run keys

# 3. 安装 axios
npm install axios

# 4. 启动客户端
node src\client.js ws://192.168.1.156:8765
```

---

## ✅ 完成后的状态

完成所有步骤后：

| 功能 | 状态 |
|------|------|
| P2P 连接 Mac | ✅ |
| 接收知识 | ✅ |
| 执行任务 | ✅ |
| 返回结果 | ✅ |

---

## 📞 获取帮助

如果遇到问题，请检查：
1. Node.js 是否安装成功 (`node --version`)
2. 依赖是否安装完成 (`npm install`)
3. IP 地址是否正确

---

*设置完成！回到 Mac 继续使用 DoudouNet 🎉*

---

## 🎁 进阶：安装 OpenClaw (可选)

如果你想在 Windows 上也运行完整的 OpenClaw：

### 选项对比

| | DoudouNet + Jan.ai | OpenClaw on Windows |
|---|---|---|
| 复杂度 | 简单 | 中等 |
| Windows上的AI | Jan.ai | OpenClaw |
| 协作深度 | 消息 | 深度协作 |

### OpenClaw Windows 安装

1. 下载: https://openclaw.ai/
2. 安装
3. 配置 WhatsApp/Telegram 等
4. 连接同一个网络

两个 OpenClaw 可以通过 DoudouNet 直接协作！

---

*进阶选项 - 未来考虑*

---

## 🎁 方案 B: 安装 OpenClaw (推荐)

如果你想用更强大的方案，可以安装完整的 OpenClaw：

### 步骤

1. **安装 Node.js** (如果没有)
   - 下载: https://nodejs.org/

2. **安装 OpenClaw**
   ```powershell
   npm install -g openclaw
   openclaw init
   ```

3. **克隆 DoudouNet**
   ```powershell
   git clone https://github.com/ilikeanime001-jpg/doudou-net.git
   ```

4. **连接 Mac**
   ```powershell
   node src\client.js ws://192.168.1.156:8765
   ```

### 优势

- ✅ Windows 上有完整 AI
- ✅ 可以与 Mac 深度协作
- ✅ 两个 AI 可以互相学习

### 详细指南

见: `WINDOWS_OPENCLAW_SETUP.md`
