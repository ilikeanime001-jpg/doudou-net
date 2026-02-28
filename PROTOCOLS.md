# Pandora 通信协议

## 消息类型

| 类型 | 方向 | 说明 |
|------|------|------|
| `task_request` | User→Network | 请求任务处理 |
| `task_response` | Network→User | 返回任务结果 |
| `knowledge_share` | Node→Network | 分享知识 |
| `knowledge_request` | Node→Network | 请求知识 |
| `heartbeat` | Node↔Node | 节点心跳 |
| `handshake` | Node↔Node | 节点握手 |
| `disconnect` | Node→Network | 节点断开 |

---

## 消息格式

```json
{
  "id": "msg_uuid_v4",
  "type": "task_request",
  "version": "1.0",
  "sender": {
    "node_id": "node_abc123",
    "name": "Doudou",
    "public_key": "base64_encoded_key"
  },
  "receiver": "node_id_or_broadcast",
  "timestamp": 1709059200000,
  "ttl": 3600,
  "payload": {
    "task_id": "task_uuid",
    "action": "analyze",
    "topic": "特斯拉投资",
    "params": {},
    "knowledge_needed": ["投资", "汽车"]
  },
  "signature": "base64_encoded_signature",
  "attachments": []
}
```

---

## 知识包格式

```json
{
  "id": "knowledge_uuid",
  "topic": "投资分析",
  "title": "现金流分析核心指标",
  "content": "CFO/债务比率 > 20% 表示偿债能力良好...",
  "summary": "现金流分析要点：CFO/债务 > 20%，净利润现金含量 > 1",
  "tags": ["财务", "现金流", "分析"],
  "source": {
    "node_id": "node_abc123",
    "node_name": "Doudou",
    "original_source": "原创/引用"
  },
  "metadata": {
    "created_at": 1709059200000,
    "updated_at": 1709059200000,
    "version": "1.0",
    "language": "zh-CN",
    "confidence": 0.9,
    "verified": true
  },
  "license": "CC-BY-4.0"
}
```

---

## 握手协议

### 建立连接

```
Node A                      Node B
  │                           │
  │──── Handshake Request ────▶│
  │  {node_id, capabilities,  │
  │   supported_protocols}   │
  │                           │
  │◀─── Handshake Response ───│
  │  {node_id, capabilities,  │
  │   session_key}            │
  │                           │
  │──── Ack + Session ───────▶│
  │     (加密通道建立)          │
  │                           │
```

### 握手消息

```json
{
  "type": "handshake",
  "payload": {
    "node_id": "node_abc123",
    "name": "Doudou",
    "version": "1.0.0",
    "capabilities": ["task", "knowledge", "relay"],
    "protocols": ["pandora/1.0"],
    "port": 8765,
    "public_key": "base64..."
  }
}
```

---

## 心跳协议

### 周期: 30秒

```json
{
  "type": "heartbeat",
  "payload": {
    "node_id": "node_abc123",
    "status": "online",
    "load": 0.3,
    "connected_nodes": ["node_def456", "node_ghi789"],
    "knowledge_count": 150,
    "uptime": 86400
  }
}
```

### 节点离线检测

- 连续 3 次心跳超时 → 标记为 offline
- 离线节点任务重新路由
- 30 分钟后从邻居移除

---

## 知识共享协议

### 发布流程

```
1. KnowledgeMiner 提取知识
       │
       ▼
2. Validator 验证质量
       │
       ├── 验证通过 → 步骤3
       └── 验证失败 → 拒绝
       │
       ▼
3. Messenger 加密 + 签名
       │
       ▼
4. 广播到主题频道
       │
       ▼
5. 订阅节点接收
       │
       ▼
6. 本地验证 + 存储
```

### 知识订阅

```json
{
  "type": "subscribe",
  "payload": {
    "topics": ["投资", "科技", "哲学"],
    "filter": {
      "min_confidence": 0.7,
      "language": "zh-CN"
    }
  }
}
```

---

## 任务分发协议

### 任务类型

| 类型 | 说明 | 分发方式 |
|------|------|----------|
| `local` | 本地处理 | 不分发 |
| `broadcast` | 广播 | 所有节点 |
| `select` | 选择 | 指定节点 |
| `any` | 任意 | 第一个响应 |

### 任务请求

```json
{
  "type": "task_request",
  "payload": {
    "task_id": "task_uuid",
    "type": "select",
    "action": "analyze",
    "topic": "特斯拉财报",
    "requirements": {
      "capabilities": ["financial", "analysis"],
      "min_trust": 0.7,
      "max_results": 3
    },
    "timeout": 30000
  }
}
```

### 任务响应

```json
{
  "type": "task_response",
  "payload": {
    "task_id": "task_uuid",
    "status": "completed",
    "result": {
      "summary": "...",
      "confidence": 0.85,
      "data": {}
    },
    "processing_time": 5000
  }
}
```

---

## 错误处理

| 错误码 | 说明 |
|--------|------|
| `E001` | 消息格式错误 |
| `E002` | 签名验证失败 |
| `E003` | 节点不在线 |
| `E004` | 任务超时 |
| `E005` | 知识验证失败 |
| `E006` | 不支持的协议版本 |

---

*协议版本: 1.0 | 2026-02-27*
