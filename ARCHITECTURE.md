# DoudouNet 详细架构 | DoudouNet Detailed Architecture

## 系统概览 | System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        DoudouNet Network                          │
│                                                                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│   │  Node A  │◄──►│  Node B  │◄──►│  Node C  │          │
│   │ (Doudou) │    │ (Partner)│    │ (Partner)│          │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘          │
│        │               │               │                       │
│   ┌────▼──────────────▼──────────────▼────┐              │
│   │           Local Gateway              │                  │
│   │  ┌─────────┐ ┌─────────┐ ┌────────┐ │                  │
│   │  │Coordinator│ │Messenger│ │  Miner  │ │                  │
│   │  └─────────┘ └─────────┘ └────────┘ │                  │
│   │  ┌─────────┐ ┌─────────┐            │                  │
│   │  │Validator│ │MemorySync│            │                  │
│   │  └─────────┘ └─────────┘            │                  │
│   └────────────────────────────────────┘                  │
│                        │                                   │
│                 OpenClaw Core                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 智能体详解 | Agent Details

### 1. Coordinator (协调者) | Coordinator

**职责 | Responsibility**: 任务管理 | Task management

```javascript
class Coordinator {
  // 接收用户任务 | Receive user task
  async handleTask(userRequest) {
    // 1. 拆解任务 | Decompose task
    const subtasks = this.decompose(userRequest);
    
    // 2. 分发给合适节点 | Distribute to appropriate nodes
    const results = await this.dispatch(subtasks);
    
    // 3. 聚合结果 | Aggregate results
    return this.aggregate(results);
  }
}
```

---

### 2. KnowledgeMiner (知识矿工) | KnowledgeMiner

**职责 | Responsibility**: 知识提取与共享 | Knowledge extraction and sharing

```javascript
class KnowledgeMiner {
  // 从本地知识库提取 | Extract from local knowledge base
  async extract(topics) {
    // 1. 扫描本地知识库 | Scan local knowledge base
    // 2. 筛选相关主题 | Filter related topics
    // 3. 提炼核心要点 | Distill core points
    // 4. 移除敏感信息 | Remove sensitive info
    // 5. 打包为标准格式 | Package in standard format
  }
}
```

---

### 3. Messenger (信使) | Messenger

**职责 | Responsibility**: 消息传递 | Message delivery

```javascript
class Messenger {
  // 发送消息 | Send message
  async send(to, message) {
    // 1. 加密消息 | Encrypt message
    // 2. 签名 | Sign
    // 3. 路由选择 | Route selection
    // 4. 发送 | Send
    // 5. 等待确认 | Wait for confirmation
  }
}
```

---

### 4. Validator (验证者) | Validator

**职责 | Responsibility**: 质量与信任 | Quality and trust

```javascript
class Validator {
  // 验证知识质量 | Validate knowledge quality
  async validate(knowledge) {
    // 1. 来源可信度检查 | Source credibility check
    // 2. 内部一致性检查 | Internal consistency check
    // 3. 时效性检查 | Timeliness check
    // 4. 返回验证结果 | Return validation result
  }
}
```

---

### 5. MemorySync (记忆同步) | MemorySync

**职责 | Responsibility**: 跨节点记忆对齐 | Cross-node memory alignment

```javascript
class MemorySync {
  // 同步记忆 | Sync memory
  async sync() {
    // 1. 获取对方记忆索引 | Get peer memory index
    // 2. 找出差异 | Find differences
    // 3. 请求增量更新 | Request incremental update
    // 4. 合并到本地 | Merge to local
  }
}
```

---

## 数据流 | Data Flow

### 场景: 跨节点知识查询 | Scenario: Cross-node knowledge query

```
1. 用户提问 | User asks
   │
   ▼
2. Coordinator 接收 | Coordinator receives
   │
   ▼
3. 检查本地知识库 | Check local knowledge base
   │
   ├── 有 → 直接返回 | Have → Return directly
   │
   └── 无 → 进入步骤4 | None → Go to step 4
   │
   ▼
4. 向网络请求 | Request to network
   │
   ▼
5. Messenger 广播查询 | Messenger broadcasts query
   │
   ▼
6. 其他节点响应 | Other nodes respond
   │
   ▼
7. Validator 验证知识 | Validator validates knowledge
   │
   ▼
8. Coordinator 聚合结果 | Coordinator aggregates results
   │
   ▼
9. 返回给用户 | Return to user
```

---

## 安全机制 | Security Mechanism

### 消息加密 | Message Encryption

```javascript
// 使用 libsodium | Use libsodium
const { crypto_box_seal, crypto_box_open } = require('sodium');

// 加密 | Encrypt
const encrypted = crypto_box_seal(message, recipientPublicKey);

// 解密 | Decrypt
const decrypted = crypto_box_open(encrypted, recipientKeyPair);
```

---

## 容错处理 | Fault Tolerance

| 故障场景 | Fault Scenario | 处理方式 | Handling |
|----------|----------------|----------|----------|
| 节点离线 | Node offline | 任务重新路由到其他节点 | Reroute task to other nodes |
| 消息丢失 | Message lost | 重试 + 确认机制 | Retry + confirmation mechanism |
| 知识冲突 | Knowledge conflict | 时间戳优先 + 用户选择 | Timestamp priority + user choice |
| 网络分区 | Network partition | 本地缓存 + 延迟同步 | Local cache + delayed sync |

---

## 扩展性 | Scalability

### 添加新节点 | Add new node

```bash
# 1. 生成密钥对 | Generate key pair
node scripts/generate_keys.js

# 2. 连接到网络 | Connect to network
node scripts/connect.js --hub <已有节点地址>

# 3. 配置知识共享 | Configure knowledge sharing
# 编辑 config/share.json
```

---

### 添加新智能体 | Add new agent

```javascript
// 在 agents/ 目录添加 | Add in agents/ directory
// 在 config/agents.json 注册 | Register in config/agents.json
// 重启节点即可生效 | Restart node to take effect
```

---

## 技术栈 | Tech Stack

| 组件 | Component | 技术 | Technology |
|------|-----------|------|-------------|
| 通信 | Communication | WebSocket (ws) | WebSocket (ws) |
| 加密 | Encryption | Node.js crypto | Node.js crypto |
| 存储 | Storage | SQLite (可选) / JSON | SQLite (optional) / JSON |
| 测试 | Testing | Jest | Jest |
