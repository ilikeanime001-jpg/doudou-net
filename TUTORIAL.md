# DoudouNet 使用教程 | DoudouNet Tutorial

## 快速开始 | Quick Start

### 1. Mac 作为服务器分享知识 | Mac as server to share knowledge

```bash
cd doudounet

# 首次: 扫描知识库 | First time: Scan knowledge base
npm run knowledge

# 启动知识广播服务器 | Start knowledge broadcast server
npm run broadcast
```

服务器会显示 | Server will show:
```
🎭 DoudouNet 知识广播服务器
端口: 8765
知识: 296 个
```

### 2. Windows 接收知识 | Windows to receive knowledge

```powershell
cd doudounet
node src/search.js
```

操作 | Operations:
1. 输入 `4` 连接服务器 | Input `4` to connect to server
2. 输入 Mac 的 IP: `192.168.1.x:8765` | Input Mac's IP: `192.168.1.x:8765`
3. 等待接收知识 | Wait to receive knowledge
4. 输入 `2` 查看已接收知识 | Input `2` to view received knowledge

### 3. 搜索知识 | Search knowledge

接收完知识后 | After receiving knowledge:
1. 输入 `1` 搜索 | Input `1` to search
2. 输入关键词，如: `投资`、`现金流`、`比亚迪` | Input keywords, e.g.: `investment`, `cash flow`, `BYD`

## 知识主题 | Knowledge Topics

- **投资** - 股票、投资框架 (216条) | Investment - stocks, investment framework (216)
- **记忆** - 每日记忆 (25条) | Memory - daily memory (25)
- **学习** - 学习笔记 (16条) | Learning - study notes (16)
- **偏好** - 用户偏好设置 | Preferences - user preferences
- **目标** - 目标和计划 | Goals - goals and plans

## 高级用法 | Advanced Usage

### 使用 P2P 模式 (双向连接) | Use P2P mode (bidirectional connection)

```bash
# Mac: 启动 P2P 服务器 | Start P2P server
npm start

# Windows: 连接 | Connect
node src/client.js ws://192.168.1.x:8765
```

### 自定义端口 | Custom port

```bash
npm run broadcast -- --port 8766
```

## 故障排除 | Troubleshooting

| 问题 | Problem | 解决方法 | Solution |
|------|---------|----------|----------|
| 连接失败 | Connection failed | 检查 IP 地址是否正确 | Check if IP address is correct |
| 知识为0 | Knowledge is 0 | 确保服务器先启动 | Make sure server starts first |
| 搜索不到 | Can't search | 先连接服务器接收知识 | Connect to server first to receive knowledge |
