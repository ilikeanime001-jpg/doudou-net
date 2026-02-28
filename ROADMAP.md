# Pandora 实现路线 - Phase 1 & 2

> **目标**: 两节点互联 + 知识流通

---

## 📅 Phase 1: 基础连接 (Week 1-2)

### 任务清单

| 任务 | 说明 | 优先级 |
|------|------|--------|
| 1.1 | 节点身份生成 (密钥对) | P0 |
| 1.2 | WebSocket 服务器/客户端 | P0 |
| 1.3 | 节点握手协议 | P0 |
| 1.4 | 心跳机制 | P0 |
| 1.5 | 消息编解码 | P1 |
| 1.6 | 节点发现 | P1 |

### 交付物

```
scripts/
├── generate_keys.js    # 生成节点密钥对
├── server.js           # WebSocket 服务器
├── client.js           # 客户端连接
├── handshake.js        # 握手协议
├── heartbeat.js        # 心跳
└── message.js          # 消息编解码
```

### 核心代码结构

```javascript
// 1. 节点身份
class NodeIdentity {
  generateKeyPair()     // 生成密钥对
  getNodeId()           // 获取节点ID
  sign(message)         // 消息签名
  verify(message)       // 签名验证
}

// 2. 网络连接
class Network {
  startServer(port)     // 启动服务器
  connect(address)      // 连接其他节点
  send(message)         // 发送消息
  onMessage(handler)    // 消息处理
}

// 3. 心跳
class Heartbeat {
  start(interval)       // 启动心跳
  stop()                // 停止
  isOnline(nodeId)      // 检查在线状态
}
```

---

## 📅 Phase 2: 知识流通 (Week 3-4)

### 任务清单

| 任务 | 说明 | 优先级 |
|------|------|--------|
| 2.1 | 本地知识扫描 | P0 |
| 2.2 | 知识蒸馏 (移除敏感信息) | P0 |
| 2.3 | 知识打包 (标准格式) | P0 |
| 2.4 | 知识广播 (按主题) | P1 |
| 2.5 | 知识接收与存储 | P1 |
| 2.6 | 知识搜索 | P1 |

### 交付物

```
scripts/
├── knowledge/
│   ├── scanner.js      # 扫描本地知识库
│   ├── distiller.js   # 知识蒸馏
│   ├── packager.js    # 打包标准格式
│   ├── broadcaster.js # 知识广播
│   ├── receiver.js    # 接收知识
│   └── search.js      # 知识搜索
```

### 知识包格式

```javascript
{
  id: "uuid",
  topic: "投资",
  title: "现金流分析要点",
  summary: "CFO/债务 > 20% 表示良好",
  tags: ["财务", "现金流"],
  source_node: "node_id",
  source_name: "Doudou",
  created_at: timestamp,
  confidence: 0.9
}
```

---

## 🎯 每周目标

### Week 1: 节点互联

| 天 | 任务 |
|----|------|
| 1-2 | 环境搭建 + 密钥生成 |
| 3-4 | WebSocket 基础连接 |
| 5-7 | 握手 + 心跳 |

### Week 2: 消息通信

| 天 | 任务 |
|----|------|
| 1-2 | 消息格式 + 编解码 |
| 3-4 | 节点发现机制 |
| 5-7 | 完整通信测试 |

### Week 3: 知识扫描

| 天 | 任务 |
|----|------|
| 1-2 | 扫描本地知识库 |
| 3-4 | 知识蒸馏逻辑 |
| 5-7 | 打包 + 测试 |

### Week 4: 知识流通

| 天 | 任务 |
|----|------|
| 1-2 | 广播 + 接收 |
| 3-4 | 搜索功能 |
| 5-7 | 端到端测试 |

---

## 🔧 技术选型

| 组件 | 技术 |
|------|------|
| 通信 | WebSocket (ws) |
| 加密 | Node.js crypto |
| 存储 | SQLite (可选) / JSON文件 |
| 测试 | Jest |

---

## ✅ 验收标准

### Phase 1 完成

- [ ] 两台设备通过 WebSocket 互联成功
- [ ] 节点握手正常
- [ ] 心跳检测在线状态
- [ ] 消息发送/接收正常

### Phase 2 完成

- [ ] 本地知识库扫描正常
- [ ] 知识打包为标准格式
- [ ] 知识广播到其他节点
- [ ] 接收并存储外部知识
- [ ] 知识搜索功能正常

---

## 🚀 立即开始

```bash
cd projects/pandora

# 创建目录
mkdir -p scripts/knowledge

# 安装依赖 (如需要)
# npm install ws crypto

# 开始 Phase 1
node scripts/generate_keys.js
```

---

*目标: 2周内完成两节点互联 + 知识流通原型*
