# DoudouNet 分层开源结构 | DoudouNet Layered Open Source Structure

> 平衡社区贡献与商业利益 | Balance community contribution and commercial interests

---

## 🏗️ 整体架构 | Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DoudouNet Ecosystem                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │   Open Source (MIT)  │    │  Closed Source       │        │
│   │   开源部分 (MIT)     │    │  闭源部分            │        │
│   ├──────────────────────┤    ├──────────────────────┤        │
│   │                      │    │                      │        │
│   │  • 核心协议          │    │  • 高级算法          │        │
│   │  • 基础实现          │    │  • 云服务            │        │
│   │  • 文档              │    │  • 企业功能          │        │
│   │  • 客户端            │    │  • 商业插件         │        │
│   │                      │    │                      │        │
│   └──────────────────────┘    └──────────────────────┘        │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                     Commercial Services                  │  │
│   │                     商业服务                             │  │
│   │  • 托管服务 • 技术支持 • 定制开发 • 企业版               │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 目录结构 | Directory Structure

```
doudounet/
│
├── 📂 src-open/                 # 🌐 开源核心 (MIT License)
│   │
│   ├── 📂 core/                 # 核心协议实现
│   │   ├── server.js             # P2P 服务器
│   │   ├── client.js             # 客户端
│   │   ├── protocol.js           # 协议实现
│   │   └── crypto.js             # 基础加密
│   │
│   ├── 📂 client/                # 客户端实现
│   │   ├── web-client.js         # Web 客户端
│   │   ├── cli-client.js        # CLI 客户端
│   │   └── mobile/               # 移动端客户端
│   │
│   ├── 📂 protocols/             # 通信协议
│   │   ├── v1/                   # v1 协议
│   │   └── v2/                   # v2 协议
│   │
│   └── 📂 examples/              # 示例代码
│       ├── basic-server/         # 基础服务器示例
│       └── simple-client/        # 简单客户端示例
│
├── 📂 src-closed/               # 🔒 闭源商业 (Proprietary)
│   │
│   ├── 📂 advanced/              # 高级功能
│   │   ├── ai-optimizer.js       # AI 优化算法
│   │   ├── smart-routing.js      # 智能路由
│   │   └── predictive-cache.js   # 预测缓存
│   │
│   ├── 📂 cloud/                 # 云服务
│   │   ├── pan-cloud.js          # 托管服务
│   │   ├── enterprise-auth.js    # 企业认证
│   │   └── analytics.js          # 数据分析
│   │
│   └── 📂 plugins/               # 商业插件
│       ├── enterprise-sync/      # 企业同步
│       ├── priority-support/     # 优先支持
│       └── custom-integration/    # 定制集成
│
├── 📂 docs-open/                 # 📖 开源文档
│   ├── README.md
│   ├── TUTORIAL.md
│   ├── API.md
│   └── PROTOCOLS.md
│
├── 📂 docs-closed/              # 📖 闭源文档
│   ├── ARCHITECTURE.md          # 详细架构
│   ├── SECURITY.md              # 安全设计
│   └── ENTERPRISE.md            # 企业功能
│
├── 📂 commercial/                # 💰 商业化
│   ├── PRICING.md               # 定价策略
│   ├── SERVICES.md              # 服务条款
│   └── CONTRACTS/               # 合同模板
│
├── LICENSE                       # MIT 许可证
├── LICENSE-COMMERCIAL            # 商业许可证
└── TRADEMARK.md                 # 商标保护
```

---

## 🌐 开源部分 (MIT) | Open Source Part (MIT)

### 为什么选择 MIT？

| 优势 | Advantage |
|------|-----------|
| ✅ 限制少 | Few restrictions |
| ✅ 吸引开发者 | Attract developers |
| ✅ 便于商业使用 | Easy for commercial use |
| ✅ 快速传播 | Fast distribution |

### 开源内容

```
src-open/
├── core/          # 基础 P2P 实现
├── client/        # 客户端 SDK
├── protocols/    # 标准协议
└── examples/     # 学习示例
```

**任何人可以**：
- ✅ 使用、学习、修改
- ✅ 用于商业产品
- ✅ 分发、私用
- ✅ 使用专利（已授权）

**必须保留**：
- ⚠️ 版权声明
- ⚠️ 许可证声明

---

## 🔒 闭源部分 | Closed Source Part

### 闭源内容

```
src-closed/
├── advanced/     # 核心竞争力
├── cloud/       # 云服务
└── plugins/     # 商业插件
```

### 商业价值

| 产品 | Product | 目标客户 | Target Customers |
|------|---------|----------|------------------|
| Pan-Cloud | 云托管服务 | 中小企业 | SMBs |
| Enterprise | 企业版 | 大企业 | Enterprises |
| Support | 技术支持 | 所有客户 | All customers |
| Custom | 定制开发 | 有特殊需求客户 | Custom needs |

---

## 💰 商业模式 | Business Model

### 收入来源 | Revenue Streams

```
┌─────────────────────────────────────────────────────────────┐
│                    Revenue Model                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. SaaS 订阅 (60%)                                        │
│     ├── 免费版: 基础功能                                    │
│     ├── 专业版: $9/月 • 高级功能                            │
│     └── 企业版: $99/月 • 全部功能                          │
│                                                              │
│  2. 服务收入 (25%)                                         │
│     ├── 技术咨询: $150/小时                                 │
│     ├── 定制开发: 按项目收费                               │
│     └── 培训: $500/人                                       │
│                                                              │
│  3. 授权收入 (15%)                                         │
│     ├── OEM 授权: 按设备收费                              │
│     └── 转售许可: 合作伙伴                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚖️ 法律保护 | Legal Protection

### 1. 双重许可证 | Dual Licensing

```
开源版: MIT License
   └── 任何人可免费使用

商业版: Commercial License
   └── 需要购买授权
```

### 2. 商标保护 | Trademark Protection

| 商标 | 状态 | Protection |
|------|------|------------|
| DoudouNet Network | ✅ 已注册 | 文字商标 |
| ⭐ DoudouNet Logo | ✅ 已注册 | 图形商标 |
| Pan-Cloud | ⏳ 待注册 | 服务商标 |

### 3. 专利保护 | Patent Protection

- 核心算法可以申请专利
- 但专利公开 = 技术泄露
- **建议**: 商业秘密 > 专利

---

## 🚀 发布计划 | Release Plan

### Phase 1: 建立社区 (Month 1-3)

```
✓ 全部开源 (MIT)
✓ 吸引开发者
✓ 收集反馈
✓ 建立品牌
```

### Phase 2: 商业化 (Month 4-6)

```
• 发布 Pan-Cloud Beta
• 推出专业版
• 建立技术支持
```

### Phase 3: 生态系统 (Month 7-12)

```
• 合作伙伴计划
• OEM 授权
• 收购/并购可能
```

---

## 📝 创始人保护条款 | Founder Protection

### 1. 知识产权 | Intellectual Property

- ✅ 所有代码版权归属创始人
- ✅ 商标归创始人所有
- ✅ 专利申请权归创始人

### 2. 商业权益 | Commercial Rights

- ✅ 创始人保留商业化权利
- ✅ 贡献者无商业化权利 (除明确约定)
- ✅ 开源不影响商业授权

### 3. 未来条款 | Future Provisions

- 若项目被收购：
  - 创始人优先回购权
  - 员工安置条款
  - 品牌延续条款

---

## 🤔 常见问题 | FAQ

### Q: 为什么不全部闭源？

A: 
- 建立社区和品牌
- 吸引开发者贡献
- 降低营销成本
- 获得用户信任

### Q: 如何防止别人 fork 后商业化？

A: 
- 无法完全防止
- 但你有：
  - 品牌优势
  - 先发优势
  - 云服务优势
  - 支持服务优势

### Q: 贡献者代码怎么处理？

A: 
- 贡献者保留版权
- 贡献即授权 (MIT)
- 商业使用需单独授权

---

## 📜 许可证文本 | License Texts

### MIT License (开源)

```text
MIT License

Copyright (c) 2026 DoudouNet Network

Permission is hereby granted... (标准MIT条款)
```

### Commercial License (商业)

```text
Commercial License Agreement

Copyright (c) 2026 DoudouNet Network
All Rights Reserved.

Commercial use requires written permission...
```

详见: LICENSE-COMMERCIAL

---

*让 DoudouNet 成为分布式AI的标准！| Make DoudouNet the standard for distributed AI! 🌟*
