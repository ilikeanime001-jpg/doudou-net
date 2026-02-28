# 协作模块 | Collaboration Module

## 功能 | Features

- **task_manager.js** - 任务管理
- **client.js** - 协作客户端
- **review.js** - 复盘系统
- **optimizer.js** - 优化引擎

## 使用 | Usage

```javascript
const TaskManager = require('./task_manager');
const tm = new TaskManager();

// 创建项目
const project = tm.createProject('DoudouNet', '分布式协作网络', 'Doudou');

// 添加任务
tm.addTask(project.id, '开发功能X', '描述', ' assignee', '2026-03-01');

// 创建复盘
const ReviewSystem = require('./review');
const review = new ReviewSystem();
review.create(project.id, {
  what: '完成了什么',
  how: '怎么做',
  why: '为什么',
  learn: ['经验1', '经验2'],
  action: ['改进行动1']
});
```
