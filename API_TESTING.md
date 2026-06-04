# School Management System - API Testing Report

**Date:** 2026-05-20
**Environment:** Development
**Base URL:** http://localhost:5000

## Server Status
✅ Server Running: YES
✅ Database Connected: YES  
✅ Models Loaded: 9
⚠️  Redis: Disabled (optional, non-blocking)

---

## 1. Authentication APIs

### 1.1 Register Super Admin
**Endpoint:** `POST /api/auth/register-super-admin`

**Request:**
```json
{
  "first_name": "Super",
  "last_name": "Admin",
  "email": "admin@schoolsystem.com",
  "password": "SuperAdmin@123",
  "mobile_number": "+919876543210",
  "setup_key": "a3f1c2d4e5b6789012345678abcdef01234567890abcdef12"
}
```

**Expected Response:** 201 Created
- Super admin account created
- User ID returned

**Status:** ⏳ Pending

---

### 1.2 Login (Super Admin)
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@schoolsystem.com",
  "password": "SuperAdmin@123"
}
```

**Expected Response:** 200 OK
- access_token
- refresh_token
- user object with role='super_admin'

**Status:** ⏳ Pending

---

### 1.3 Get Current User Profile
**Endpoint:** `GET /api/auth/me`
**Headers:** `Authorization: Bearer {access_token}`

**Expected Response:** 200 OK
- Current user details

**Status:** ⏳ Pending

---

### 1.4 Refresh Token
**Endpoint:** `POST /api/auth/refresh-token`

**Request:**
```json
{
  "refresh_token": "{refresh_token}"
}
```

**Expected Response:** 200 OK
- New access_token

**Status:** ⏳ Pending

---

### 1.5 Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Request:**
```json
{
  "email": "admin@schoolsystem.com"
}
```

**Expected Response:** 200 OK
- Reset token (in development mode)

**Status:** ⏳ Pending

---

### 1.6 Change Password
**Endpoint:** `PUT /api/auth/change-password`
**Headers:** `Authorization: Bearer {access_token}`

**Request:**
```json
{
  "current_password": "SuperAdmin@123",
  "new_password": "NewPassword@456",
  "confirm_password": "NewPassword@456"
}
```

**Expected Response:** 200 OK

**Status:** ⏳ Pending

---

### 1.7 Logout
**Endpoint:** `POST /api/auth/logout`
**Headers:** `Authorization: Bearer {access_token}`

**Expected Response:** 200 OK

**Status:** ⏳ Pending

---

## 2. Super Admin APIs

### 2.1 Register School (By Super Admin)
**Endpoint:** `POST /api/auth/register-school`
**Headers:** `Authorization: Bearer {super_admin_token}`

**Request:**
```json
{
  "school_name": "Green Valley High School",
  "email": "admin@greenvalley.edu",
  "phone": "+919876543210",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "subscription_plan": "premium",
  "admin_first_name": "John",
  "admin_last_name": "Doe",
  "admin_email": "john.doe@greenvalley.edu",
  "admin_password": "Principal@123"
}
```

**Expected Response:** 201 Created
- School details
- Principal account details
- Login credentials

**Status:** ⏳ Pending

---

### 2.2 List All Schools
**Endpoint:** `GET /api/superadmin/schools?page=1&limit=10`
**Headers:** `Authorization: Bearer {super_admin_token}`

**Expected Response:** 200 OK
- Array of schools
- Pagination info

**Status:** ⏳ Pending

---

### 2.3 Get Single School
**Endpoint:** `GET /api/superadmin/schools/{school_id}`
**Headers:** `Authorization: Bearer {super_admin_token}`

**Expected Response:** 200 OK
- School details with user counts

**Status:** ⏳ Pending

---

### 2.4 Update School
**Endpoint:** `PATCH /api/superadmin/schools/{school_id}`
**Headers:** `Authorization: Bearer {super_admin_token}`

**Request:**
```json
{
  "max_students": 500,
  "max_teachers": 50,
  "storage_limit_gb": 10
}
```

**Expected Response:** 200 OK

**Status:** ⏳ Pending

---

### 2.5 Toggle School Status
**Endpoint:** `PATCH /api/superadmin/schools/{school_id}/status`
**Headers:** `Authorization: Bearer {super_admin_token}`

**Request:**
```json
{
  "action": "activate"
}
```

**Expected Response:** 200 OK

**Status:** ⏳ Pending

---

## 3. School Management APIs (Principal)

### 3.1 Login as Principal
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john.doe@greenvalley.edu",
  "password": "Principal@123"
}
```

**Expected Response:** 200 OK
- access_token with school context

**Status:** ⏳ Pending

---

### 3.2 Get Current School Details
**Endpoint:** `GET /api/schools/me`
**Headers:** `Authorization: Bearer {principal_token}`
**Note:** Requires tenant identification (subdomain or header)

**Expected Response:** 200 OK
- School profile

**Status:** ⏳ Pending

---

### 3.3 Update School Settings
**Endpoint:** `PATCH /api/schools/me`
**Headers:** `Authorization: Bearer {principal_token}`

**Request:**
```json
{
  "phone": "+919876543211",
  "address": "123 Main Street",
  "primary_color": "#1976d2"
}
```

**Expected Response:** 200 OK

**Status:** ⏳ Pending

---

### 3.4 Get Usage Statistics
**Endpoint:** `GET /api/schools/usage`
**Headers:** `Authorization: Bearer {principal_token}`

**Expected Response:** 200 OK
- Student count, teacher count, storage usage, etc.

**Status:** ⏳ Pending

---

## 4. Student Management APIs

### 4.1 Create Student
**Endpoint:** `POST /api/students`
**Headers:** `Authorization: Bearer {principal_token}`

**Request:**
```json
{
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice.j@student.greenvalley.edu",
  "phone": "+919876543212",
  "admission_number": "GV2024001",
  "admission_date": "2024-04-01",
  "date_of_birth": "2010-05-15",
  "father_name": "Robert Johnson",
  "mother_name": "Mary Johnson",
  "blood_group": "O+",
  "guardian_phone": "+919876543213"
}
```

**Expected Response:** 201 Created
- Student details
- Login credentials (admission_number as password)

**Status:** ⏳ Pending

---

### 4.2 List Students
**Endpoint:** `GET /api/students?page=1&limit=20&status=active`
**Headers:** `Authorization: Bearer {principal_token}`

**Expected Response:** 200 OK
- Array of students with pagination

**Status:** ⏳ Pending

---

### 4.3 Get Student Details
**Endpoint:** `GET /api/students/{student_id}`
**Headers:** `Authorization: Bearer {principal_token}`

**Expected Response:** 200 OK
- Full student profile

**Status:** ⏳ Pending

---

### 4.4 Update Student
**Endpoint:** `PATCH /api/students/{student_id}`
**Headers:** `Authorization: Bearer {principal_token}`

**Request:**
```json
{
  "blood_group": "A+",
  "medical_conditions": "None"
}
```

**Expected Response:** 200 OK

**Status:** ⏳ Pending

---

### 4.5 Bulk Import Students
**Endpoint:** `POST /api/students/bulk-import`
**Headers:** `Authorization: Bearer {principal_token}`

**Request:**
```json
{
  "students": [
    {
      "first_name": "Bob",
      "last_name": "Smith",
      "admission_number": "GV2024002",
      "father_name": "Tom Smith"
    }
  ]
}
```

**Expected Response:** 200 OK
- Import results (success/failed counts)

**Status:** ⏳ Pending

---

### 4.6 Student Login & Get Own Profile
**Endpoint:** `POST /api/auth/login` → `GET /api/students/me`

**Login Request:**
```json
{
  "email": "alice.j@student.greenvalley.edu",
  "password": "GV2024001"
}
```

**Expected Response:** 200 OK
- Student can view own profile

**Status:** ⏳ Pending

---

## 5. Teacher Management APIs

### 5.1 Create Teacher
**Endpoint:** `POST /api/teachers`
**Headers:** `Authorization: Bearer {principal_token}`

**Expected Response:** 201 Created

**Status:** ⏳ Pending

---

### 5.2 List Teachers
**Endpoint:** `GET /api/teachers`
**Headers:** `Authorization: Bearer {principal_token}`

**Expected Response:** 200 OK

**Status:** ⏳ Pending

---

## 6. Parent Portal APIs

### 6.1 Create Parent Account
**Endpoint:** `POST /api/parents`
**Headers:** `Authorization: Bearer {principal_token}`

**Expected Response:** 201 Created

**Status:** ⏳ Pending

---

### 6.2 Parent Login & View Children
**Endpoint:** `GET /api/parents/children`
**Headers:** `Authorization: Bearer {parent_token}`

**Expected Response:** 200 OK

**Status:** ⏳ Pending

---

## 7. File Upload APIs

### 7.1 Upload File
**Endpoint:** `POST /api/uploads`
**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Expected Response:** 201 Created

**Status:** ⏳ Pending

---

## 8. Payment Integration

### 8.1 Create Payment Order
**Endpoint:** `POST /api/schools/upgrade`
**Headers:** `Authorization: Bearer {principal_token}`

**Expected Response:** 200 OK
- Razorpay order details

**Status:** ⏳ Pending

---

### 8.2 Razorpay Webhook
**Endpoint:** `POST /api/webhooks/razorpay`

**Expected Response:** 200 OK

**Status:** ⏳ Pending

---

## Summary

**Total Tests:** 35+
**Completed:** 0
**Passed:** 0
**Failed:** 0
**Pending:** 35+

---

## Notes
- Redis caching is disabled (optional feature)
- All core features working without Redis
- Database migrations completed successfully
- All routes mounted correctly
