# Pandora 详细架构

## 系统概览

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pandora Network                          │
│                                                                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│   │  Node A  │◄──►│  Node B  │◄──►│  Node C  │               │
│   │ (Doudou) │    │ (Partner)│    │ (Partner)│               │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘               │
│        │               │               │                       │
│   ┌────▼──────────────▼──────────────▼────┐                  │
│   │           Local Gateway              │                  │
│   │  ┌─────────┐ ┌─────────┐ ┌────────┐ │                  │
│   │  │Coordintor│ │Messenger│ │Miner   │ │                  │
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

## 智能体详解

### 1. Coordinator (协调者)

**职责**: 任务管理

```javascript
class Coordinator {
  // 接收用户任务
  async handleTask(userRequest) {
    // 1. 拆解任务
    const subtasks = this.decompose(userRequest);
    
    // 2. 分发给合适节点
    const results = await this.dispatch(subtasks);
    
    // 3. 聚合结果
    return this.aggregate(results);
  }
  
  // 任务拆解算法
  decompose(task) {
    // 简单任务 → 直接处理
    // 复杂任务 → 拆分为子任务
    // 分布式任务 → 分发给多个节点
  }
  
  // 节点选择算法
  selectNode(task, availableNodes) {
    // 根据节点专长、信任度、在线状态选择
  }
}
```

### 2. KnowledgeMiner (知识矿工)

**职责**: 知识提取与共享

```javascript
class KnowledgeMiner {
  // 从本地知识库提取
  async extract(topics) {
    // 1. 扫描本地知识库
    // 2. 筛选相关主题
    // 3. 提炼核心要点
    // 4. 移除敏感信息
    // 5. 打包为标准格式
  }
  
  // 知识格式
  knowledgePacket = {
    topic: "投资",
    title: "现金流分析要点",
    summary: "CFO/债务 > 20% 为健康",
    tags: ["财务", "分析"],
    source: "Doudou",
    timestamp: Date.now(),
    confidence: 0.9
  }
}
```

### 3. Messenger (信使)

**职责**: 消息传递

```javascript
class Messenger {
  // 发送消息
  async send(to, message) {
    // 1. 加密消息
    // 2. 签名
    // 3. 路由选择
    // 4. 发送
    // 5. 等待确认
  }
  
  // 接收消息
  async receive(message) {
    // 1. 验证签名
    // 2. 解密
    // 3. 转发或处理
  }
  
  // 广播知识
  async broadcast(knowledge, topic) {
    // 找到订阅该主题的节点
    const nodes = this.findNodesByTopic(topic);
    // 发送知识包
  }
}
```

### 4. Validator (验证者)

**职责**: 质量与信任

```javascript
class Validator {
  // 验证知识质量
  async validate(knowledge) {
    // 1. 来源可信度检查
    // 2. 内部一致性检查
    // 3. 时效性检查
    // 4. 返回验证结果
  }
  
  // 计算节点信任度
  calculateTrust(nodeId) {
    const history = this.getInteractionHistory(nodeId);
    const score = 
      history.successRate * 0.4 +
      history.validationPassRate * 0.3 +
      history.contribution * 0.2 +
      history.uptime * 0.1;
    return score;
  }
}
```

### 5. MemorySync (记忆同步)

**职责**: 跨节点记忆对齐

```javascript
class MemorySync {
  // 同步记忆
  async sync() {
    // 1. 获取对方记忆索引
    // 2. 找出差异
    // 3. 请求增量更新
    // 4. 合并到本地
  }
  
  // 增量同步
  async incrementalSync(lastSyncTime) {
    // 只同步新增内容
  }
}
```

---

## 数据流

### 场景: 跨节点知识查询

```
1. 用户提问
   │
   ▼
2. Coordinator 接收
   │
   ▼
3. 检查本地知识库
   │
   ├── 有 → 直接返回
   │
   └── 无 → 进入步骤4
   │
   ▼
4. 向网络请求
   │
   ▼
5. Messenger 广播查询
   │
   ▼
6. 其他节点响应
   │
   ▼
7. Validator 验证知识
   │
   ▼
8. Coordinator 聚合结果
   │
   ▼
9. 返回给用户
```

---

## 安全机制

### 消息加密

```javascript
// 使用 libsodium
const { crypto_box_seal, crypto_box_open } = require('sodium');

// 加密
const encrypted = crypto_box_seal(message, recipientPublicKey);

// 解密
const decrypted = crypto_box_open(encrypted, recipientKeyPair);
```

### 签名验证

```javascript
const { crypto_sign, crypto_sign_open } = require('sodium');

// 签名
const signed = crypto_sign(message, privateKey);

// 验证
const verified = crypto_sign_open(signed, senderPublicKey);
```

---

## 容错处理

| 故障场景 | 处理方式 |
|----------|----------|
| 节点离线 | 任务重新路由到其他节点 |
| 消息丢失 | 重试 + 确认机制 |
| 知识冲突 | 时间戳优先 + 用户选择 |
| 网络分区 | 本地缓存 + 延迟同步 |

---

## 扩展性

### 添加新节点

```bash
# 1. 生成密钥对
node scripts/generate_keys.js

# 2. 连接到网络
node scripts/connect.js --hub <已有节点地址>

# 3. 配置知识共享
# 编辑 config/share.json
```

### 添加新智能体

```javascript
// 在 agents/ 目录添加
// 在 config/agents.json 注册
// 重启节点即可生效
```

---

*版本: v0.1 | 2026-02-27*
