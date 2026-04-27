# CardFlow 后端API文档

## 项目介绍

CardFlow是一个专业的发卡平台，提供一站式发卡解决方案，从卡片设计到分发管理，全流程自动化。本后端API为前端提供数据支持和业务逻辑处理。

## 技术栈

- Node.js + Express
- MongoDB
- JWT认证
- CORS跨域支持
- Express-validator数据验证

## 项目结构

```
backend/
├── config/
│   └── db.js          # 数据库连接配置
├── middleware/
│   └── auth.js        # 认证中间件
├── models/
│   ├── User.js        # 用户模型
│   ├── Card.js        # 卡片模型
│   ├── Design.js      # 卡片设计模型
│   ├── Transaction.js # 交易记录模型
│   └── Pricing.js     # 定价方案模型
├── routes/
│   ├── auth.js        # 认证路由
│   ├── cards.js       # 卡片管理路由
│   ├── designs.js     # 卡片设计路由
│   ├── analytics.js   # 数据分析路由
│   └── pricing.js     # 定价管理路由
├── index.js           # 主入口文件
├── package.json       # 项目配置
└── .env               # 环境变量
```

## API端点

### 认证相关

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 用户登录 | 否 |
| GET | /api/auth/me | 获取当前用户信息 | 是 |

### 卡片管理

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/cards | 创建卡片 | 是 |
| GET | /api/cards | 获取用户的所有卡片 | 是 |
| GET | /api/cards/:id | 获取单个卡片详情 | 是 |
| PUT | /api/cards/:id | 更新卡片信息 | 是 |
| DELETE | /api/cards/:id | 删除卡片 | 是 |
| PUT | /api/cards/:id/activate | 激活卡片 | 是 |
| PUT | /api/cards/:id/deactivate | 停用卡片 | 是 |
| PUT | /api/cards/:id/block | 冻结卡片 | 是 |

### 卡片设计管理

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/designs | 创建卡片设计 | 是 |
| GET | /api/designs | 获取用户的所有设计 | 是 |
| GET | /api/designs/:id | 获取单个设计详情 | 是 |
| PUT | /api/designs/:id | 更新设计信息 | 是 |
| DELETE | /api/designs/:id | 删除设计 | 是 |

### 数据分析

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/analytics/transactions/:card_id | 获取卡片交易记录 | 是 |
| GET | /api/analytics/transactions | 获取用户所有交易记录 | 是 |
| GET | /api/analytics/card/:card_id | 获取卡片余额和使用情况 | 是 |
| GET | /api/analytics/overview | 获取用户卡片概览 | 是 |
| GET | /api/analytics/categories | 获取支出分类统计 | 是 |

### 定价管理

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/pricing | 获取所有定价方案 | 否 |
| GET | /api/pricing/recommended | 获取推荐定价方案 | 否 |
| POST | /api/pricing | 创建定价方案 | 是（管理员） |
| PUT | /api/pricing/:id | 更新定价方案 | 是（管理员） |
| DELETE | /api/pricing/:id | 删除定价方案 | 是（管理员） |

## 请求和响应示例

### 用户注册

**请求**:
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "company": "Example Inc"
}
```

**响应**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Inc",
    "role": "user"
  }
}
```

### 创建卡片

**请求**:
```json
POST /api/cards
{
  "card_number": "1234567890123456",
  "card_type": "debit",
  "limit": 10000
}
```

**响应**:
```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "card_number": "1234567890123456",
  "card_type": "debit",
  "status": "inactive",
  "balance": 0,
  "limit": 10000,
  "user_id": "60d21b4667d0d8992e610c85",
  "created_at": "2023-06-22T10:00:00.000Z"
}
```

## 环境变量

在`.env`文件中配置以下环境变量：

```
# MongoDB连接字符串
MONGO_URI=mongodb://localhost:27017/cardflow

# JWT密钥
JWT_SECRET=your_jwt_secret_key

# 服务器端口
PORT=5000

# 环境
NODE_ENV=development
```

## 启动项目

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 启动生产服务器：
   ```bash
   npm start
   ```

## 注意事项

- 所有需要认证的API端点都需要在请求头中添加`Authorization: Bearer <token>`
- 管理员操作需要用户角色为`admin`
- 卡片操作只能由卡片所有者进行
- 设计操作只能由设计所有者进行

## 错误处理

API返回的错误格式：

```json
{
  "message": "Error message here"
}

// 或

{
  "errors": [
    {
      "msg": "Error message here",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

## 状态码

- 200: 成功
- 400: 请求错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源未找到
- 500: 服务器错误