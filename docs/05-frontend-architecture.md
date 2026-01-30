# 前端架构

## 项目结构

```
todo-app/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProfileModal.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── DropdownMenu.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   ├── CreateProjectModal.tsx
│   │   │   ├── ProjectSettingsModal.tsx
│   │   │   └── ProjectMembersModal.tsx
│   │   ├── kanban/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   ├── TaskDependencyGraph.tsx
│   │   │   └── TaskActionsMenu.tsx
│   │   └── hooks/
│   │       ├── useAuth.ts
│   │       ├── useProjects.ts
│   │       └── useTasks.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ProjectList.tsx
│   │   ├── ProjectBoard.tsx
│   │   └── NotFound.tsx
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── projectStore.ts
│   │   └── taskStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   └── taskService.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── favicon.ico
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 技术细节

### 状态管理 (Zustand)

```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (credentials: LoginParams) => Promise<void>;
  register: (data: RegisterParams) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileParams) => Promise<void>;
}
```

### 路由配置

```typescript
// App.tsx
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/projects',
        element: <ProjectList />,
      },
      {
        path: '/projects/:id',
        element: <ProjectBoard />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
```

### API 服务

```typescript
// api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// 请求拦截器 - 自动添加 token
api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理认证错误
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 样式设计

- 使用 **Tailwind CSS** 实现 Vercel 风格的深色/浅色主题
- 主要颜色方案：
  - 背景: `bg-white` / `bg-gray-900`
  - 文字: `text-gray-900` / `text-gray-100`
  - 主色: `blue-600` / `blue-500`
  - 边框: `gray-200` / `gray-700`

## 页面组件

### 登录/注册页面

- 表单验证（Zod）
- 记住登录状态
- 错误提示

### 仪表盘

- 显示所有项目概览
- 快速创建任务入口
- 最近活动

### 项目列表

- 卡片式项目展示
- 创建/删除项目
- 搜索筛选

### 项目看板

- 看板视图（Kanban Board）
- 拖拽排序
- 任务详情弹窗
- 任务依赖可视化
- 列锁定状态显示
