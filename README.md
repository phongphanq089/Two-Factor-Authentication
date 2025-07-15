# 🔐 Two-Factor Authentication (2FA) App - React + Fastify

Dự án mô phỏng hệ thống xác thực 2 bước (2FA - Two-Factor Authentication) **thực tế**, giúp tăng bảo mật khi đăng nhập.

- ✅ Đăng ký / Đăng nhập
- ✅ Kích hoạt / Xác minh 2FA bằng Google Authenticator
- ✅ Quét mã QR để bật xác thực OTP
- ✅ Quản lý session đăng nhập (đa thiết bị)
- ✅ Có thể tắt 2FA bất kỳ lúc nào

---

## 🧱 Công nghệ sử dụng

### 💻 Frontend

| Tech             | Vai trò                   |
| ---------------- | ------------------------- |
| **React**        | Xây dựng giao diện        |
| **TypeScript**   | Kiểm soát kiểu dữ liệu    |
| **React Router** | Điều hướng giữa các trang |

### 🛠 Backend

| Tech                     | Vai trò                          |
| ------------------------ | -------------------------------- |
| **Fastify**              | Web framework siêu nhẹ và nhanh  |
| **TypeScript**           | Strict typing                    |
| **NeDB (nedb-promises)** | Cơ sở dữ liệu giả lập (local)    |
| **bcrypt**               | Mã hóa mật khẩu                  |
| **otplib**               | Tạo & xác thực mã 2FA (TOTP)     |
| **qrcode**               | Sinh QR code để quét vào app 2FA |

---

## 🔐 Các chức năng chính

### 👤 Xác thực người dùng

- `POST /register`: Đăng ký tài khoản mới
- `POST /login`: Đăng nhập, nếu bật 2FA thì cần thêm bước xác minh

### 🔑 2FA

- `POST /enable-2fa`: Kích hoạt 2FA → server sinh QR code
- `POST /verify-2fa-setup`: Xác minh mã OTP từ Google Authenticator
- `POST /verify-2fa-login`: Xác minh mã OTP khi đăng nhập
- `POST /disable-2fa`: Tắt 2FA
- `GET /validate-session/:sessionId`: Kiểm tra session hiện tại

### 🚪 Logout

- `POST /logout`: Xóa session

---

## 📱 Luồng sử dụng 2FA

```mermaid
sequenceDiagram
  participant User
  participant React App
  participant Fastify Server
  participant NeDB

  User->>React App: Đăng nhập email + mật khẩu
  React App->>Fastify: POST /login
  Fastify->>NeDB: Kiểm tra tài khoản
  Fastify-->>React App: Nếu có 2FA → yêu cầu mã OTP

  User->>Google Authenticator: Lấy mã OTP
  User->>React App: Nhập mã OTP
  React App->>Fastify: POST /verify-2fa-login
  Fastify->>NeDB: Kiểm tra mã OTP
  Fastify-->>React App: Thành công ✅
```

![Logo RBAC](https://phongph.netlify.app/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fi6rvgdeu%2Fproduction%2Ff6ec1a80e3accdc7c8620b02018bcc92f7639ce9-2048x1222.jpg&w=1920&q=75)
