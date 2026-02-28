# DoudouNet 实现路线 | DoudouNet Implementation Roadmap

> **目标**: 两节点互联 + 知识流通 | **Goal**: Two-node connection + knowledge circulation

---

## 📅 Phase 1: 基础连接 (Week 1-2) | Phase 1: Basic Connection (Week 1-2)

### 任务清单 | Task List

| 任务 | Task | 说明 | Description | 优先级 | Priority |
|------|------|------|-------------|----------|-----------|
| 1.1 | 节点身份生成 (密钥对) | Node identity generation (key pair) | P0 |
| 1.2 | WebSocket 服务器/客户端 | WebSocket server/client | P0 |
| 1.3 | 节点握手协议 | Node handshake protocol | P0 |
| 1.4 | 心跳机制 | Heartbeat mechanism | P0 |
| 1.5 | 消息编解码 | Message encoding/decoding | P1 |
| 1.6 | 节点发现 | Node discovery | P1 |

---

## 📅 Phase 2: 知识流通 (Week 3-4) | Phase 2: Knowledge Circulation (Week 3-4)

### 任务清单 | Task List

| 任务 | Task | 说明 | Description | 优先级 | Priority |
|------|------|------|-------------|----------|-----------|
| 2.1 | 本地知识扫描 | Local knowledge scanning | P0 |
| 2.2 | 知识蒸馏 (移除敏感信息) | Knowledge distillation (remove sensitive info) | P0 |
| 2.3 | 知识打包 (标准格式) | Knowledge packaging (standard format) | P0 |
| 2.4 | 知识广播 (按主题) | Knowledge broadcast (by topic) | P1 |
| 2.5 | 知识接收与存储 | Knowledge receiving and storage | P1 |
| 2.6 | 知识搜索 | Knowledge search | P1 |

---

## 📅 Phase 3: 任务协作 (Week 5-6) | Phase 3: Task Collaboration (Week 5-6)

### 任务清单 | Task List

| 任务 | Task | 说明 | Description |
|------|------|------|-------------|
| 3.1 | 任务拆解 | Task decomposition |
| 3.2 | 任务分发 | Task distribution |
| 3.3 | 结果聚合 | Result aggregation |
| 3.4 | 跨节点协调 | Cross-node coordination |

---

## 📅 Phase 4: 优化 (Week 7-8) | Phase 4: Optimization (Week 7-8)

### 任务清单 | Task List

| 任务 | Task | 说明 | Description |
|------|------|------|-------------|
| 4.1 | 信任系统 | Trust system |
| 4.2 | 激励机制 | Incentive mechanism |
| 4.3 | 安全加固 | Security hardening |
| 4.4 | 性能优化 | Performance optimization |

---

## 🎯 每周目标 | Weekly Goals

### Week 1: 节点互联 | Week 1: Node Connection

| 天 | Day | 任务 | Task |
|----|-----|------|------|
| 1-2 | 环境搭建 + 密钥生成 | Environment setup + key generation |
| 3-4 | WebSocket 基础连接 | WebSocket basic connection |
| 5-7 | 握手 + 心跳 | Handshake + heartbeat |

### Week 2: 消息通信 | Week 2: Message Communication

| 天 | Day | 任务 | Task |
|----|-----|------|------|
| 1-2 | 消息格式 + 编解码 | Message format + encoding |
| 3-4 | 节点发现机制 | Node discovery mechanism |
| 5-7 | 完整通信测试 | Complete communication test |

---

## ✅ 验收标准 | Acceptance Criteria

### Phase 1 完成 | Phase 1 Complete

- [x] 两台设备通过 WebSocket 互联成功 | Two devices connected via WebSocket successfully
- [x] 节点握手正常 | Node handshake normal
- [x] 心跳检测在线状态 | Heartbeat detects online status
- [x] 消息发送/接收正常 | Message sending/receiving normal

### Phase 2 完成 | Phase 2 Complete

- [x] 本地知识库扫描正常 | Local knowledge base scanning normal
- [x] 知识打包为标准格式 | Knowledge packaged in standard format
- [x] 知识广播到其他节点 | Knowledge broadcast to other nodes
- [x] 接收并存储外部知识 | Receive and store external knowledge
- [x] 知识搜索功能正常 | Knowledge search function normal
