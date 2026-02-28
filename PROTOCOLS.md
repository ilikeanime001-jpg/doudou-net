# DoudouNet 通信协议 | DoudouNet Communication Protocols

## 消息格式 | Message Format

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
    "topic": "特斯拉投资 | Tesla Investment",
    "params": {}
  },
  "signature": "base64_encoded_signature"
}
```

---

## 握手协议 | Handshake Protocol

```
Node A                      Node B
  |                           |
  |---- Handshake Request ---->|
  |                           |
  |<--- Handshake Response -----|
  |                           |
  |---- Ack + Session ------>|
      (加密通道建立)            (Encrypted channel established)
```

---

## 心跳协议 | Heartbeat Protocol

### 周期 | Period: 30秒 | 30 seconds

```json
{
  "type": "heartbeat",
  "payload": {
    "node_id": "node_abc123",
    "status": "online",
    "load": 0.3,
    "connected_nodes": ["node_def456"],
    "knowledge_count": 150,
    "uptime": 86400
  }
}
```

---

## 错误码 | Error Codes

| 错误码 | Error Code | 说明 | Description |
|--------|-------------|------|-------------|
| E001 | 消息格式错误 | Message format error |
| E002 | 签名验证失败 | Signature verification failed |
| E003 | 节点不在线 | Node offline |
| E004 | 任务超时 | Task timeout |
| E005 | 知识验证失败 | Knowledge validation failed |
| E006 | 不支持的协议版本 | Unsupported protocol version |
