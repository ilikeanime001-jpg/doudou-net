# DoudouNet 协作协议 | Collaboration Protocol

> 多节点协同开发、复盘、优化 | Multi-node collaborative development, review, optimization

---

## 🤝 协作模式 | Collaboration Modes

### 1. 一起开发 (Joint Development)

```
发起者                    参与者
   |                        |
   |-- 项目任务邀请 -------->|
   |                        |
   |<-- 接受/拒绝 ----------|
   |                        |
   |-- 任务分解 ------------>|
   |<-- 进度更新 -----------|
   |                        |
   |-- 代码/成果合并 ------>|
   |                        |
   |-- 复盘请求 ------------>|
```

### 2. 复盘 (Review/Retro)

```
复盘会议:
1. 成果展示 (What)
2. 过程分析 (How)  
3. 原因分析 (Why)
4. 经验总结 (Learn)
5. 改进行动 (Action)
```

### 3. 优化 (Optimization)

```
优化流程:
1. 收集问题
2. 优先级排序
3. 分配任务
4. 执行优化
5. 验证结果
```

---

## 📋 消息类型 | Message Types

| 类型 | 说明 | Payload |
|------|------|---------|
| COLLAB_INVITE | 协作邀请 | {project, task, deadline} |
| COLLAB_ACCEPT | 接受 | {invite_id} |
| COLLAB_REJECT | 拒绝 | {invite_id, reason} |
| TASK_SPLIT | 任务分解 | {tasks: []} |
| TASK_UPDATE | 进度更新 | {task_id, status, progress} |
| TASK_COMPLETE | 任务完成 | {task_id, result} |
| REVIEW_REQUEST | 复盘请求 | {project, items: []} |
| REVIEW_SESSION | 复盘会议 | {notes: [], actions: []} |
| OPTIMIZE_REQUEST | 优化请求 | {issues: [], priority} |
| OPTIMIZE_RESULT | 优化结果 | {changes: [], impact} |

---

## 🎯 功能模块 | Feature Modules

### 1. 项目管理 (Project Manager)

- 创建项目
- 分配任务
- 跟踪进度
- 里程碑管理

### 2. 实时协作 (Real-time Collaboration)

- 代码/文件共享
- 屏幕共享 (future)
- 语音沟通 (future)

### 3. 复盘系统 (Review System)

- 自动记录
- 经验提取
- 知识沉淀

### 4. 优化引擎 (Optimization Engine)

- 问题追踪
- 优先级排序
- 自动化优化

---

## 📊 协作流程 | Collaboration Flow

```
1. 发起协作
   ↓
2. 参与者加入
   ↓
3. 任务分配
   ↓
4. 执行&同步
   ↓
5. 复盘总结
   ↓
6. 优化迭代
```

---

## 🔧 实现状态 | Implementation Status

| 功能 | 状态 | 说明 |
|------|------|------|
| 基础连接 | ✅ | P2P WebSocket |
| 消息传递 | ✅ | JSON 协议 |
| 知识共享 | ✅ | 广播机制 |
| 项目管理 | ⏳ | 开发中 |
| 复盘系统 | ⏳ | 开发中 |
| 优化引擎 | ⏳ | 开发中 |
