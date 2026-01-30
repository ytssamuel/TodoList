# 待辦事項管理系統 (Todo App)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)

一個功能完整的全棧待辦事項管理網站，參照專案管理模式，支援任務狀態流轉、任務依賴關係、看板列順序鎖定等功能。

## 📋 目錄

- [功能特色](#功能特色)
- [技術棧](#技術棧)
- [專案結構](#專案結構)
- [快速開始](#快速開始)
- [環境變數](#環境變數)
- [API 文件](#api-文件)
- [部署](#部署)
- [貢獻指南](#貢獻指南)
- [授權](#授權)

---

## ✨ 功能特色

### 使用者功能
- [x] 使用者註冊與登入
- [x] JWT 認證
- [x] 個人資料管理

### 專案功能
- [x] 建立、編輯、刪除專案
- [x] 專案成員管理
- [x] 搜尋與篩選專案

### 任務功能
- [x] 建立、編輯、刪除任務
- [x] 任務狀態流轉（Backlog → Ready → In Progress → Review → Done）
- [x] 任務優先級（低/中/高/緊急）
- [x] 截止日期設定
- [x] 任務指派
- [x] 看板視圖（Kanban Board）
- [x] 拖拽排序

### 進階功能
- [x] 任務依賴關係
- [x] 看板列順序鎖定
- [x] 深色/淺色主題
- [x] RWD 響應式設計

---

## 🛠 技術棧

### 前端
| 技術 | 用途 |
|------|------|
| React 18+ | UI 框架 |
| Vite 5+ | 建構工具 |
| TypeScript 5+ | 類型安全 |
| Tailwind CSS 3+ | 樣式框架 |
| shadcn/ui | 組件庫 |
| React Router 6+ | 路由管理 |
| Zustand | 狀態管理 |
| React Hook Form 7+ | 表單處理 |
| Zod | 資料驗證 |
| Axios | HTTP 客戶端 |

### 後端
| 技術 | 用途 |
|------|------|
| Node.js 20+ | 執行環境 |
| Express 4+ | Web 框架 |
| TypeScript 5+ | 類型安全 |
| Prisma 5+ | ORM |
| PostgreSQL 15+ | 資料庫 |
| JWT | 認證 |
| bcrypt 5+ | 密碼加密 |

---

## 📁 專案結構

```
todo-app/
├── frontend/                 # 前端專案
│   ├── src/
│   │   ├── components/       # React 組件
│   │   │   ├── auth/         # 認證相關
│   │   │   ├── common/       # 共用組件
│   │   │   ├── layout/       # 佈局組件
│   │   │   ├── projects/     # 專案相關
│   │   │   └── kanban/       # 看板相關
│   │   ├── pages/            # 頁面
│   │   ├── store/            # 狀態管理
│   │   ├── services/         # API 服務
│   │   ├── utils/            # 工具函數
│   │   └── App.tsx
│   └── ...
│
├── backend/                  # 後端專案
│   ├── src/
│   │   ├── controllers/      # 控制器
│   │   ├── middlewares/      # 中間件
│   │   ├── routes/           # 路由
│   │   ├── services/         # 服務層
│   │   ├── utils/            # 工具函數
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma     # 資料庫 Schema
│   └── ...
│
├── docs/                     # 文件
│   ├── 01-project-overview.md
│   ├── 02-tech-stack.md
│   ├── 03-database-schema.md
│   ├── 04-api-design.md
│   ├── 05-frontend-architecture.md
│   ├── 06-features.md
│   └── 07-deployment.md
│
└── README.md
```

---

## 🚀 快速開始

### 前置需求

- Node.js 20+
- PostgreSQL 資料庫
- Git

### 安裝步驟

1. **Clone 專案**

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

2. **安裝前端依賴**

```bash
cd frontend
npm install
```

3. **安裝後端依賴**

```bash
cd ../backend
npm install
```

4. **設定環境變數**

```bash
# 前端
cp ../frontend/.env.example ../frontend/.env

# 後端
cp .env.example .env
```

5. **初始化資料庫**

```bash
npx prisma migrate dev
npx prisma generate
```

6. **啟動開發伺服器**

```bash
# 終端機 1 - 前端
cd frontend
npm run dev

# 終端機 2 - 後端
cd backend
npm run dev
```

7. **開啟瀏覽器**

- 前端：http://localhost:5173
- 後端：http://localhost:3000

---

## 🔐 環境變數

### 前端環境變數 (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=待辦事項管理系統
```

### 後端環境變數 (.env)

```env
# 資料庫
DATABASE_URL=postgresql://user:password@localhost:5432/todo_app

# 認證
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# 伺服器
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 📚 API 文件

API 文件位於 [docs/04-api-design.md](docs/04-api-design.md)

### 主要模組

| 模組 | 端點前綴 | 描述 |
|------|----------|------|
| 認證 | `/api/auth` | 使用者註冊、登入 |
| 專案 | `/api/projects` | 專案 CRUD、成員管理 |
| 任務 | `/api/tasks` | 任務 CRUD、狀態更新 |
| 看板列 | `/api/columns` | 看板列管理 |

---

## ☁️ 部署

### 前端部署 (Vercel)

1. 推送程式碼到 GitHub
2. 在 Vercel 控制台導入倉庫
3. 設定建構命令：`npm run build`
4. 設定輸出目錄：`dist`
5. 設定環境變數
6. 部署

### 後端部署 (Render)

1. 推送程式碼到 GitHub
2. 在 Render 控制台創建 Web Service
3. 連接 GitHub 倉庫
4. 設定建構命令：`npm install && npm run build`
5. 設定啟動命令：`npm start`
6. 設定環境變數
7. 部署

### 資料庫 (Render PostgreSQL / Supabase)

1. 創建 PostgreSQL 資料庫
2. 取得連接字串
3. 設定 `DATABASE_URL` 環境變數
4. 執行資料庫遷移

詳細部署指南請參閱 [docs/07-deployment.md](docs/07-deployment.md)

---

## 🤝 貢獻指南

1. Fork 本專案
2. 創建分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📄 授權

本專案採用 MIT 授權 - 請參閱 [LICENSE](LICENSE) 檔案

---

## 📞 聯繫

- 專案維護者：[你的名稱]
- 問題回報：[GitHub Issues](https://github.com/yourusername/todo-app/issues)
