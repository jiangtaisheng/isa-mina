## 你是一个10年的小程序架构师
## 深呼吸，一步步解决
## 这个问题值1500块，如果你能完美解决的话
## 


## 需求描述：
登录注册模块。
开发一个登录/注册模块页面（账号密码方式注册方式），注册登录页面设计的好看一点。登录成功后，再跳到tab主页。
登录成功后，获取token，sid，保存token，sid。之后登录成功后的请求再请求头中都要加入sid 。
每次重新启动都先判断有没有token，有token就调用自动登录接口，获取sid。如果没有token，就 展示登录注册页面，登录成功后，进入主页。

注册接口：

## 1️⃣ 用户注册

```bash
curl -X POST "https://api.jiangtaisheng.top/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123!"
  }'
```

**成功响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user_id": 1
  }
}
```

**错误响应**:
```json
{
  "code": 1001,
  "message": "Username already exists",
  "data": null
}
```



登录接口
**接口**: `POST /api/login`

**服务地址**: `https://api.jiangtaisheng.top/api/login`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | ✅ | 用户名或邮箱 |
| password | string | ✅ | 密码 |

**请求示例**:

```bash
curl -X POST "https://api.jiangtaisheng.top/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@example.com",
    "password": "your_password123"
  }'
```
**成功响应** (200 OK):

```json
{
  "code": 0,
  "data": {
    "expires_at": "2026-01-18T09:12:43.599824",
    "sid": "sid_f3858bd06486b72c6fc2341cc4da81fed0b5faa768aadf317c9c3214d2beee0d",
    "token": "tk_faab5aa08bfb46caba3e1213bf7608c2_b7b9e6cdbb6bab7ae0483541953e6a4b"
  },
  "message": "Login successful"
}
```

**错误响应** (401 Unauthorized):

```json
{
  "code": 401,
  "message": "用户名或密码错误"
}
```



自动登录
## 5️⃣ 自动登录 (Token 换取 SID)

当已有 token 但需要新的 SID 时使用：

```bash
curl -X POST "https://api.jiangtaisheng.top/auth/auto-login" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**成功响应**:
```json
{
  "code": 0,
  "message": "Auto login successful",
  "data": {
    "sid": "d4e5f6a7-b8c9-0123-def0-1234567890ab",
    "expires_at": "2026-01-12T19:00:00Z"
  }
}
```