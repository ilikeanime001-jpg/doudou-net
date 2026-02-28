# DoudouNet for Windows | Windows 版 DoudouNet

> 本指南帮助你快速在 Windows 上运行 DoudouNet | This guide helps you quickly run DoudouNet on Windows

---

## 🚀 快速开始 | Quick Start

### 方法 1: 一键运行 (推荐) | Method 1: One-click run (recommended)

1. **下载项目** | Download project
   - 从 GitHub 克隆或下载 ZIP | Clone or download ZIP from GitHub
   - 解压到文件夹 | Extract to folder

2. **双击运行** | Double-click to run
   ```
   双击 quick-connect.bat | Double-click quick-connect.bat
   ```

3. **按提示操作** | Follow prompts
   - 选择连接方式 | Choose connection method
   - 输入服务器IP | Input server IP

---

### 方法 2: 命令行 | Method 2: Command line

```powershell
# 安装依赖 | Install dependencies
npm install

# 生成密钥 | Generate keys
npm run keys

# 启动客户端 | Start client
npm run start:client -- ws://<服务器IP>:8765
```

---

## 📋 Windows 批处理文件 | Windows Batch Files

| 文件 | File | 用途 | Purpose |
|------|------|------|---------|
| quick-connect.bat | 快速连接 (带菜单) | Quick connect (with menu) |
| connect.bat | 手动输入IP连接 | Manual IP input connection |
| search.bat | 知识搜索客户端 | Knowledge search client |
| quick-start.bat | 快速启动 | Quick start |

---

## 🔧 常见问题 | FAQ

### Q: 双击 bat 文件闪退？| Q: Double-click bat file flashes and closes?

A: 右键 → "以管理员身份运行"，或先打开 PowerShell/CMD 再运行 | A: Right-click → "Run as administrator", or open PowerShell/CMD first then run

### Q: 提示 "node 不是内部或外部命令"？| Q: Prompts "node is not recognized as an internal or external command"?

A: 安装 Node.js: https://nodejs.org/ | A: Install Node.js: https://nodejs.org/

### Q: 端口被占用？| Q: Port is occupied?

A: 关闭其他程序，或修改端口: | A: Close other programs, or change port:
```bash
npm run start:client -- --port 8767 ws://<IP>:8767
```

### Q: 连接失败？| Q: Connection failed?

A: 检查: | A: Check:
1. 两台电脑在同一 WiFi | Two computers on same WiFi
2. 防火墙允许 8765 端口 | Firewall allows port 8765
3. 服务器IP正确 | Server IP correct

---

## 🔨 手动安装 Node.js | Manual Node.js Installation

1. 下载: https://nodejs.org/ | Download: https://nodejs.org/
2. 安装时勾选 "Add to PATH" | Check "Add to PATH" during installation
3. 重启终端 | Restart terminal

---

## 📞 获取帮助 | Get Help

- GitHub Issues: https://github.com/ilikeanime001/doudounet/issues

---

*让 DoudouNet 连接你的AI！| Let DoudouNet connect your AI! 🌐*
