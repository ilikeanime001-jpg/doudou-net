# Pandora API 接口文档 | Pandora API Documentation

## 消息类型 | Message Types

| 类型 | Type | 说明 | Description | 方向 | Direction |
|------|------|------|-------------|------|------------|
| handshake | 握手 | 握手 | Handshake | 双向 | Bidirectional |
| handshake_ack | 握手确认 | 握手确认 | Handshake acknowledgment | 双向 | Bidirectional |
| knowledge_share | 知识分享 | 知识分享 | Knowledge sharing | 双向 | Bidirectional |
| knowledge_request | 知识请求 | 知识请求 | Knowledge request | 双向 | Bidirectional |
| task_request | 任务请求 | 任务请求 | Task request | 双向 | Bidirectional |
| task_response | 任务响应 | 任务响应 | Task response | 双向 | Bidirectional |
| heartbeat | 心跳 | 心跳 | Heartbeat | 双向 | Bidirectional |

---

## 知识包格式 | Knowledge Packet Format

```json
{
  "type": "knowledge_share",
  "payload": {
    "id": "uuid",
    "title": "标题 | Title",
    "summary": "摘要 | Summary",
    "topic": "主题 | Topic",
    "tags": ["标签 | Tags"],
    "source": {
      "node_id": "节点ID | Node ID",
      "node_name": "节点名称 | Node Name"
    },
    "metadata": {
      "confidence": 0.9,
      "created_at": 1234567890
    }
  }
}
```

---

## 端口 | Ports

| 端口 | Port | 说明 | Description |
|------|------|------|-------------|
| 8765 | P2P服务器 | P2P server |
| 8767 | 知识广播 | Knowledge broadcast |
| 8080 | Web界面 | Web interface |
| 3000 | REST API | REST API |

---

## REST API 端点 | REST API Endpoints

| 方法 | Method | 端点 | Endpoint | 说明 | Description |
|------|---------|------|-----------|------|-------------|
| GET | /api/knowledge | 知识列表 | Knowledge list | 获取所有知识 | Get all knowledge |
| GET | /api/knowledge/:id | 知识详情 | Knowledge detail | 获取单条知识 | Get single knowledge |
| GET | /api/stats | 统计信息 | Statistics | 获取统计 | Get statistics |
| GET | /health | 健康检查 | Health check | 服务状态 | Service status |
