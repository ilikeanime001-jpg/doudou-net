# Pandora API 接口文档

## 消息类型

| 类型 | 说明 | 方向 |
|------|------|------|
| `handshake` | 握手 | 双向 |
| `handshake_ack` | 握手确认 | 双向 |
| `knowledge_share` | 知识分享 | 双向 |
| `knowledge_request` | 知识请求 | 双向 |
| `task_request` | 任务请求 | 双向 |
| `task_response` | 任务响应 | 双向 |
| `heartbeat` | 心跳 | 双向 |

## 知识包格式

```json
{
  "type": "knowledge_share",
  "payload": {
    "id": "uuid",
    "title": "标题",
    "summary": "摘要",
    "topic": "主题",
    "tags": ["标签"],
    "source": {
      "node_id": "节点ID",
      "node_name": "节点名称"
    },
    "metadata": {
      "confidence": 0.9,
      "created_at": 1234567890
    }
  }
}
```

## 端口

| 端口 | 说明 |
|------|------|
| 8765 | P2P服务器 |
| 8767 | 知识广播 |
| 8080 | Web界面 |
