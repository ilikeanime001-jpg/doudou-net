# Pandora for Windows

> 本指南帮助你快速在 Windows 上运行 Pandora

---

## 🚀 快速开始

### 方法 1: 一键运行 (推荐)

1. **下载项目**
   - 从 GitHub 克隆或下载 ZIP
   - 解压到文件夹

2. **双击运行**
   ```
   quick-connect.bat
   ```

3. **按提示操作**
   - 选择连接方式
   - 输入服务器IP

---

### 方法 2: 命令行

```powershell
# 1. 安装依赖
npm install

# 2. 生成密钥
npm run keys

# 3. 启动客户端
npm run start:client -- ws://<服务器IP>:8765
```

---

## 📋 Windows 批处理文件

| 文件 | 用途 |
|------|------|
| `quick-connect.bat` | 快速连接 (带菜单) |
| `connect.bat` | 手动输入IP连接 |
| `install.bat` | 安装依赖 |

---

## 🔧 常见问题

### Q: 双击 bat 文件闪退？

A: 右键 → "以管理员身份运行"，或先打开 PowerShell/CMD 再运行

### Q: 提示 "node 不是内部或外部命令"

A: 安装 Node.js: https://nodejs.org/

### Q: 端口被占用？

A: 关闭其他程序，或修改端口:
```bash
npm run start:client -- --port 8767 ws://<IP>:8767
```

### Q: 连接失败？

A: 检查:
1. 两台电脑在同一 WiFi
2. 防火墙允许 8765 端口
3. 服务器IP正确

---

## 🔨 手动安装 Node.js

1. 下载: https://nodejs.org/
2. 安装时勾选 "Add to PATH"
3. 重启终端

---

## 📞 获取帮助

- GitHub Issues: https://github.com/ilikeanime001/pandora/issues

---

让 Pandora 连接你的AI！🌐
