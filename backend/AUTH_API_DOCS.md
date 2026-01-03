# Backend Authentication API - Problem Statement 3.1

## Implemented Endpoints

### 1. SIGNUP - POST /api/auth/signup
Register a new user with role-based access

**Request Body:**
```json
{
  "employeeId": "EMP001",
  "email": "john@company.com",
  "password": "SecurePass123!",
  "role": "EMPLOYEE"  // or "HR"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*...)

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "userId": "clv9xyz123",
    "email": "john@company.com",
    "role": "EMPLOYEE",
    "employeeId": "EMP001",
    "isEmailVerified": false
  },
  "verificationToken": "eyJhbGc...",
  "instructions": "Check your email for verification link (valid for 24 hours)"
}
```

---

### 2. VERIFY EMAIL - POST /api/auth/verify-email
Verify user's email address (Required before login)

**Request Body:**
```json
{
  "token": "eyJhbGc..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "userId": "clv9xyz123",
    "email": "john@company.com",
    "isEmailVerified": true
  }
}
```

---

### 3. SIGNIN - POST /api/auth/signin
Login with email and password

**Request Body:**
```json
{
  "email": "john@company.com",
  "password": "SecurePass123!"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "clv9xyz123",
    "email": "john@company.com",
    "role": "EMPLOYEE",
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGc...",
  "redirectUrl": "/dashboard/employee"
}
```

**Error Response (Incorrect Credentials):**
```json
{
  "success": false,
  "message": "Incorrect credentials"
}
```

---

### 4. VERIFY TOKEN - POST /api/auth/verify-token
Verify JWT token validity

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "userId": "clv9xyz123",
    "role": "EMPLOYEE"
  }
}
```

---

### 5. GET ME - GET /api/auth/me
Get current user information

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "clv9xyz123",
    "email": "john@company.com",
    "role": "EMPLOYEE",
    "isActive": true,
    "isEmailVerified": true,
    "employee": {
      "id": "emp123",
      "employeeId": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "department": "Engineering"
    }
  }
}
```

---

### 6. LOGOUT - POST /api/auth/logout
Logout user (removes token on client side)

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Features Implemented

✅ **Sign Up (Problem Statement 3.1.1)**
- Employee ID validation
- Email validation
- Password security rules (8+ chars, uppercase, lowercase, number, special char)
- Role selection (Employee/HR)
- Email verification required before login

✅ **Sign In (Problem Statement 3.1.2)**
- Email and password authentication
- Error messages for incorrect credentials
- Redirects to appropriate dashboard (HR admin or Employee)
- JWT token generation (7-day expiry)

✅ **Email Verification**
- Verification token valid for 24 hours
- Users cannot login until email is verified

✅ **Security**
- Password hashing with bcryptjs
- JWT token authentication
- Email validation
- Account status checking
- Role-based access control

---

## Testing

### Using cURL:

**Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "email": "john@company.com",
    "password": "SecurePass123!",
    "role": "EMPLOYEE"
  }'
```

**Signin (after email verification):**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@company.com",
    "password": "SecurePass123!"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <your-token-here>"
```

---

## Error Handling

- Invalid email format → 400 Bad Request
- Weak password → 400 Bad Request (with requirements feedback)
- Email already registered → 409 Conflict
- Email not verified → 403 Forbidden
- Incorrect credentials → 401 Unauthorized
- Account deactivated → 403 Forbidden
- Missing/Invalid token → 401 Unauthorized
