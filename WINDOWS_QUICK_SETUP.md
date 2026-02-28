# Windows 快速设置 | Quick Setup

## 一、安装 Node.js

1. 下载: https://nodejs.org/ (LTS)
2. 安装时勾选 "Add to PATH"

## 二、下载 DoudouNet

```powershell
# 创建文件夹
mkdir DoudouNet
cd DoudouNet

# 下载代码
git clone https://github.com/ilikeanime001-jpg/doudou-net.git .
```

## 三、安装依赖

```powershell
npm install
npm run keys
```

## 四、安装 Jan.ai

1. 下载: https://jan.ai/
2. 安装并生成 API Key
3. 保存 API Key

## 五、启动

```powershell
node src\client.js ws://192.168.1.156:8765
```

---

搞定！
