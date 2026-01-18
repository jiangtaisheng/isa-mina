## ADDED Requirements

### Requirement: User Registration

The system SHALL allow users to register a new account using a username and password. (系统必须允许用户使用用户名和密码注册新账户)

#### Scenario: Successful registration (成功注册)
- **WHEN** a user provides a valid username (3-20 alphanumeric characters) and password (minimum 8 characters with letters and numbers) (当用户提供了有效的用户名（3-20 个字母数字字符）和密码（最少 8 个字符，包含字母和数字）)
- **THEN** the system SHALL create a new user account (则系统必须创建新的用户账户)
- **AND** return a success response with user_id (并且返回包含 user_id 的成功响应)
- **AND** navigate to the login page (并且导航到登录页面)

#### Scenario: Registration with existing username (用户名已存在时的注册)
- **WHEN** a user attempts to register with a username that already exists (当用户尝试使用已存在的用户名注册)
- **THEN** the system SHALL display an error message indicating the username is taken (则系统必须显示错误消息，指示用户名已被占用)
- **AND** remain on the registration page (并且保持在注册页面)

#### Scenario: Registration with invalid credentials (凭据无效时的注册)
- **WHEN** a user provides credentials that don't meet validation requirements (当用户提供了不符合验证要求的凭据)
- **THEN** the system SHALL display appropriate validation error messages (则系统必须显示相应的验证错误消息)
- **AND** prevent the registration request from being sent (并且阻止发送注册请求)

#### Scenario: Password mismatch (密码不匹配)
- **WHEN** a user enters different values in the password and confirm password fields (当用户在密码和确认密码字段中输入了不同的值)
- **THEN** the system SHALL display an error message indicating passwords don't match (则系统必须显示错误消息，指示密码不匹配)
- **AND** prevent form submission (并且阻止表单提交)

#### Scenario: Network error during registration (注册过程中的网络错误)
- **WHEN** a network error occurs during the registration request (当注册请求期间发生网络错误)
- **THEN** the system SHALL display a user-friendly error message (则系统必须显示用户友好的错误消息)
- **AND** allow the user to retry the registration (并且允许用户重试注册)

### Requirement: User Login

The system SHALL allow registered users to log in using their username and password. (系统必须允许已注册的用户使用用户名和密码登录)

#### Scenario: Successful login (成功登录)
- **WHEN** a user provides valid username and password credentials (当用户提供了有效的用户名和密码凭据)
- **THEN** the system SHALL authenticate the user (则系统必须认证用户)
- **AND** store the returned token and SID in local storage (并且在本地存储中存储返回的 token 和 SID)
- **AND** navigate to the home/tab page (并且导航到主页/标签页)

#### Scenario: Login with invalid credentials (凭据无效时的登录)
- **WHEN** a user provides incorrect username or password (当用户提供了不正确的用户名或密码)
- **THEN** the system SHALL display an error message indicating invalid credentials (则系统必须显示错误消息，指示凭据无效)
- **AND** remain on the login page (并且保持在登录页面)

#### Scenario: Login with empty fields (字段为空时的登录)
- **WHEN** a user attempts to login with empty username or password fields (当用户尝试使用空的用户名或密码字段登录)
- **THEN** the system SHALL display validation error messages (则系统必须显示验证错误消息)
- **AND** prevent the login request from being sent (并且阻止发送登录请求)

#### Scenario: Network error during login (登录过程中的网络错误)
- **WHEN** a network error occurs during the login request (当登录请求期间发生网络错误)
- **THEN** the system SHALL display a user-friendly error message (则系统必须显示用户友好的错误消息)
- **AND** allow the user to retry the login (并且允许用户重试登录)

### Requirement: Automatic Login

The system SHALL automatically authenticate users on app startup if a valid token exists. (如果存在有效的 token，系统必须在应用启动时自动认证用户)

#### Scenario: Successful auto-login with valid token (使用有效 token 成功自动登录)
- **WHEN** the app starts and a valid token exists in local storage (当应用启动且本地存储中存在有效的 token)
- **THEN** the system SHALL call the auto-login API with the stored token (则系统必须使用存储的 token 调用自动登录 API)
- **AND** update the stored SID with the new one returned (并且使用返回的新 SID 更新存储的 SID)
- **AND** navigate directly to the home/tab page without showing login (并且直接导航到主页/标签页，不显示登录页面)

#### Scenario: Auto-login with expired or invalid token (token 过期或无效时的自动登录)
- **WHEN** the app starts but the stored token is expired or invalid (当应用启动但存储的 token 已过期或无效)
- **THEN** the system SHALL clear the invalid token from storage (则系统必须从存储中清除无效的 token)
- **AND** display the login page (并且显示登录页面)

#### Scenario: Auto-login with no token (没有 token 时的自动登录)
- **WHEN** the app starts and no token exists in local storage (当应用启动且本地存储中不存在 token)
- **THEN** the system SHALL display the login page directly (则系统必须直接显示登录页面)

#### Scenario: Network error during auto-login (自动登录过程中的网络错误)
- **WHEN** a network error occurs during the auto-login request (当自动登录请求期间发生网络错误)
- **THEN** the system SHALL display the login page (则系统必须显示登录页面)
- **AND** preserve the stored token for retry on next app launch (并且保留存储的 token，以便下次应用启动时重试)

### Requirement: Session Management

The system SHALL manage user sessions using token and SID (Session ID). (系统必须使用 token 和 SID（会话 ID）管理用户会话)

#### Scenario: Token storage after successful login (成功登录后的 token 存储)
- **WHEN** a user successfully logs in (当用户成功登录)
- **THEN** the system SHALL store the token in local storage with key 'auth_token' (则系统必须使用键 'auth_token' 在本地存储中存储 token)
- **AND** store the SID in local storage with key 'auth_sid' (并且使用键 'auth_sid' 在本地存储中存储 SID)

#### Scenario: Token retrieval for API requests (API 请求的 token 获取)
- **WHEN** making an API request (当发起 API 请求时)
- **THEN** the system SHALL retrieve the stored SID from local storage (则系统必须从本地存储中检索存储的 SID)
- **AND** include it in the request header as 'sid' (并且将其作为 'sid' 包含在请求头中)

#### Scenario: Token cleanup on logout (登出时的 token 清理)
- **WHEN** a user logs out (当用户登出)
- **THEN** the system SHALL remove the token and SID from local storage (则系统必须从本地存储中删除 token 和 SID)
- **AND** navigate to the login page (并且导航到登录页面)

#### Scenario: SID expiration during API request (API 请求期间的 SID 过期)
- **WHEN** an API request returns a 401 Unauthorized status (当 API 请求返回 401 未授权状态)
- **THEN** the system SHALL clear the stored token and SID (则系统必须清除存储的 token 和 SID)
- **AND** navigate to the login page (并且导航到登录页面)
- **AND** display a message indicating the session has expired (并且显示消息，指示会话已过期)

### Requirement: Request Interception

The system SHALL automatically inject the SID into all API requests. (系统必须自动将 SID 注入到所有 API 请求中)

#### Scenario: SID injection in request headers (请求头中的 SID 注入)
- **WHEN** any API request is made (当发起任何 API 请求时)
- **THEN** the system SHALL intercept the request (则系统必须拦截请求)
- **AND** add the SID to the request headers (并且将 SID 添加到请求头)
- **AND** proceed with the modified request (并且继续处理修改后的请求)

#### Scenario: Request without valid SID (没有有效 SID 的请求)
- **WHEN** an API request is made but no SID is stored (当发起 API 请求但没有存储 SID)
- **THEN** the system SHALL proceed without adding the SID header (则系统必须在不添加 SID 请求头的情况下继续)
- **AND** allow the backend to handle unauthenticated requests (并且允许后端处理未认证的请求)

#### Scenario: Response with 401 status (返回 401 状态的响应)
- **WHEN** any API request returns a 401 status code (当任何 API 请求返回 401 状态码)
- **THEN** the system SHALL intercept the response (则系统必须拦截响应)
- **AND** clear authentication state (并且清除认证状态)
- **AND** redirect to the login page (并且重定向到登录页面)

### Requirement: Authentication UI

The system SHALL provide attractive and user-friendly interfaces for registration and login. (系统必须为注册和登录提供美观、用户友好的界面)

#### Scenario: Login page layout (登录页面布局)
- **WHEN** the user navigates to the login page (当用户导航到登录页面)
- **THEN** the system SHALL display a centered card with gradient background (则系统必须显示带有渐变背景的居中卡片)
- **AND** show username and password input fields with icons (并且显示带图标的用户名和密码输入框)
- **AND** provide a prominent login button (并且提供突出的登录按钮)
- **AND** provide a link/button to navigate to registration (并且提供导航到注册的链接/按钮)

#### Scenario: Registration page layout (注册页面布局)
- **WHEN** the user navigates to the registration page (当用户导航到注册页面)
- **THEN** the system SHALL display a centered card with gradient background (则系统必须显示带有渐变背景的居中卡片)
- **AND** show username, password, and confirm password input fields (并且显示用户名、密码和确认密码输入框)
- **AND** provide a prominent registration button (并且提供突出的注册按钮)
- **AND** provide a link/button to navigate to login (并且提供导航到登录的链接/按钮)

#### Scenario: Form validation feedback (表单验证反馈)
- **WHEN** a user enters invalid data in any form field (当用户在任何表单字段中输入无效数据)
- **THEN** the system SHALL provide immediate visual feedback (error message, red border) (则系统必须提供即时视觉反馈（错误消息、红色边框）)
- **AND** prevent form submission until all fields are valid (并且阻止表单提交，直到所有字段都有效)

#### Scenario: Loading state during authentication (认证过程中的加载状态)
- **WHEN** a login or registration request is in progress (当登录或注册请求正在进行中)
- **THEN** the system SHALL display a loading indicator on the submit button (则系统必须在提交按钮上显示加载指示器)
- **AND** disable the submit button to prevent duplicate requests (并且禁用提交按钮以防止重复请求)

#### Scenario: Error message display (错误消息显示)
- **WHEN** an authentication error occurs (当发生认证错误时)
- **THEN** the system SHALL display a clear, user-friendly error message (则系统必须显示清晰、用户友好的错误消息)
- **AND** use a toast or inline notification for visibility (并且使用 toast 或内联通知以提高可见性)

### Requirement: Navigation Flow

The system SHALL manage navigation between authentication states and protected pages. (系统必须管理认证状态和受保护页面之间的导航)

#### Scenario: Navigate from login to registration (从登录导航到注册)
- **WHEN** a user clicks "Go to Register" on the login page (当用户在登录页面点击"去注册")
- **THEN** the system SHALL navigate to the registration page (则系统必须导航到注册页面)
- **AND** preserve any entered username for convenience (并且保留任何输入的用户名以方便操作)

#### Scenario: Navigate from registration to login (从注册导航到登录)
- **WHEN** a user clicks "Go to Login" on the registration page (当用户在注册页面点击"去登录")
- **THEN** the system SHALL navigate to the login page (则系统必须导航到登录页面)

#### Scenario: Navigate to home after successful login (成功登录后导航到主页)
- **WHEN** a user successfully logs in (当用户成功登录)
- **THEN** the system SHALL navigate to the tab/home page (则系统必须导航到标签/主页)
- **AND** prevent back navigation to login page (并且阻止返回导航到登录页面)

#### Scenario: Redirect to login from protected page (从受保护页面重定向到登录)
- **WHEN** an unauthenticated user attempts to access a protected page (当未认证的用户尝试访问受保护的页面)
- **THEN** the system SHALL redirect to the login page (则系统必须重定向到登录页面)
- **AND** store the intended destination for post-login redirect (optional enhancement) (并且存储预期目的地以便登录后重定向（可选增强）)

### Requirement: Startup Authentication Check

The system SHALL check authentication status on app startup and route accordingly. (系统必须在应用启动时检查认证状态并相应地路由)

#### Scenario: App launch with authenticated user (已认证用户的应用启动)
- **WHEN** the app launches and a valid token exists (当应用启动且存在有效的 token)
- **THEN** the system SHALL perform auto-login (则系统必须执行自动登录)
- **AND** if successful, display the home page directly (并且如果成功，直接显示主页)
- **AND** not show the login page at any point (并且不显示登录页面)

#### Scenario: App launch with unauthenticated user (未认证用户的应用启动)
- **WHEN** the app launches and no valid token exists (当应用启动且不存在有效的 token)
- **THEN** the system SHALL display the login page (则系统必须显示登录页面)
- **AND** not display the home page until authenticated (并且在认证之前不显示主页)

#### Scenario: Auto-login failure during startup (启动期间自动登录失败)
- **WHEN** auto-login fails during app startup (当应用启动期间自动登录失败)
- **THEN** the system SHALL clear invalid credentials (则系统必须清除无效的凭据)
- **AND** display the login page (并且显示登录页面)
- **AND** allow user to manually log in (并且允许用户手动登录)
