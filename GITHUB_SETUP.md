# GitHub 上传指南

## 方法 1: 命令行 (推荐)

### 1. 在 GitHub 创建仓库

访问: https://github.com/new

创建新仓库，名称: `pandora`

### 2. 推送代码

```bash
# 添加远程仓库
git remote add origin https://github.com/ilikeanime001/pandora.git

# 推送代码
git push -u origin main
```

## 方法 2: GitHub CLI

```bash
# 安装 GitHub CLI (如需要)
brew install gh

# 登录
gh auth login

# 创建仓库
gh repo create pandora --public --source=. --push
```

## 方法 3: 手动上传

1. 下载 ZIP: 点击 Code → Download ZIP
2. 在 GitHub 创建新仓库
3. 上传文件

## 推送后

```bash
# 每次更新
git add .
git commit -m "更新说明"
git push
```

---

**仓库地址**: https://github.com/ilikeanime001/pandora
