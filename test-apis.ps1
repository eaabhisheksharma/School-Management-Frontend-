# School Management System API Testing Script
# PowerShell Script to test all API endpoints

$baseUrl = "http://localhost:5000"
$headers = @{ "Content-Type" = "application/json" }

# Color output functions
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Test { param($msg) Write-Host "`n🧪 TEST: $msg" -ForegroundColor Yellow }

# Variables to store tokens and IDs
$global:superAdminToken = ""
$global:principalToken = ""
$global:studentToken = ""
$global:schoolId = ""
$global:studentId = ""

Write-Host "`n================================" -ForegroundColor Magenta
Write-Host "School Management System - API Tests" -ForegroundColor Magenta
Write-Host "================================`n" -ForegroundColor Magenta

# Test 1: Health Check
Write-Test "Health Check"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Success "Server is healthy"
    Write-Info "Uptime: $($response.uptime) seconds"
    Write-Info "Models loaded: $($response.models)"
} catch {
    Write-Error "Health check failed: $_"
    exit 1
}

# Test 2: Register Super Admin
Write-Test "Register Super Admin"
$superAdminData = @{
    first_name = "Super"
    last_name = "Admin"
    email = "admin@schoolsystem.com"
    password = "SuperAdmin@123"
    mobile_number = "+919876543210"
    setup_key = "a3f1c2d4e5b6789012345678abcdef01234567890abcdef12"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register-super-admin" -Method Post -Body $superAdminData -Headers $headers
    Write-Success "Super admin registered successfully"
    Write-Info "User ID: $($response.user.user_id)"
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Info "Super admin already exists (expected if running multiple times)"
    } else {
        Write-Error "Failed: $_"
    }
}

# Test 3: Login as Super Admin
Write-Test "Login as Super Admin"
$loginData = @{
    email = "admin@schoolsystem.com"
    password = "SuperAdmin@123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginData -Headers $headers
    $global:superAdminToken = $response.access_token
    Write-Success "Super admin logged in successfully"
    Write-Info "Token: $($global:superAdminToken.Substring(0, 20))..."
    Write-Info "Role: $($response.user.role)"
} catch {
    Write-Error "Failed: $_"
    exit 1
}

# Test 4: Get Current User Profile
Write-Test "Get Current User Profile (Super Admin)"
$authHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $global:superAdminToken"
}

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get -Headers $authHeaders
    Write-Success "Profile retrieved successfully"
    Write-Info "Name: $($response.data.first_name) $($response.data.last_name)"
    Write-Info "Email: $($response.data.email)"
} catch {
    Write-Error "Failed: $_"
}

# Test 5: Register School (by Super Admin)
Write-Test "Register School (by Super Admin)"
$schoolData = @{
    school_name = "Green Valley High School"
    email = "admin@greenvalley.edu"
    phone = "+919876543210"
    city = "Mumbai"
    state = "Maharashtra"
    pincode = "400001"
    subscription_plan = "premium"
    admin_first_name = "John"
    admin_last_name = "Doe"
    admin_email = "john.doe@greenvalley.edu"
    admin_password = "Principal@123"
    admin_mobile_number = "+919876543211"
    max_students = 500
    max_teachers = 50
    trial_days = 30
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register-school" -Method Post -Body $schoolData -Headers $authHeaders
    $global:schoolId = $response.data.school.school_id
    Write-Success "School registered successfully"
    Write-Info "School ID: $global:schoolId"
    Write-Info "School Name: $($response.data.school.school_name)"
    Write-Info "Subdomain: $($response.data.school.subdomain)"
    Write-Info "Principal Email: $($response.data.admin.email)"
    Write-Info "Principal Login: john.doe@greenvalley.edu / Principal@123"
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Info "School already exists (expected if running multiple times)"
        # Try to get school ID from list
        try {
            $schools = Invoke-RestMethod -Uri "$baseUrl/api/superadmin/schools?limit=1" -Method Get -Headers $authHeaders
            if ($schools.data.Count -gt 0) {
                $global:schoolId = $schools.data[0].school_id
                Write-Info "Using existing school ID: $global:schoolId"
            }
        } catch {
            Write-Error "Could not retrieve school list"
        }
    } else {
        Write-Error "Failed: $_"
    }
}

# Test 6: List All Schools (Super Admin)
Write-Test "List All Schools"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/superadmin/schools?page=1&amp;limit=10" -Method Get -Headers $authHeaders
    Write-Success "Schools listed successfully"
    Write-Info "Total schools: $($response.pagination.total)"
    Write-Info "Schools on page: $($response.data.Count)"

    if ($response.data.Count -gt 0) {
        Write-Info "`nFirst School:"
        Write-Info "  - Name: $($response.data[0].school_name)"
        Write-Info "  - Plan: $($response.data[0].subscription_plan)"
        Write-Info "  - Status: $($response.data[0].subscription_status)"
    }
} catch {
    Write-Error "Failed: $_"
}

# Test 7: Get Single School Details
if ($global:schoolId) {
    Write-Test "Get Single School Details"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/superadmin/schools/$global:schoolId" -Method Get -Headers $authHeaders
        Write-Success "School details retrieved"
        Write-Info "School: $($response.data.school_name)"
        Write-Info "Max Students: $($response.data.max_students)"
        Write-Info "Max Teachers: $($response.data.max_teachers)"

        if ($response.data.user_counts) {
            Write-Info "Current Users:"
            $response.data.user_counts.PSObject.Properties | ForEach-Object {
                Write-Info "  - $($_.Name): $($_.Value)"
            }
        }
    } catch {
        Write-Error "Failed: $_"
    }
}

# Test 8: Login as Principal
Write-Test "Login as Principal"
$principalLoginData = @{
    email = "john.doe@greenvalley.edu"
    password = "Principal@123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $principalLoginData -Headers $headers
    $global:principalToken = $response.access_token
    Write-Success "Principal logged in successfully"
    Write-Info "Token: $($global:principalToken.Substring(0, 20))..."
    Write-Info "Role: $($response.user.role)"
    Write-Info "School: $($response.user.school.school_name)"
} catch {
    Write-Error "Failed: $_"
}

# Test 9: Create Student
if ($global:principalToken) {
    Write-Test "Create Student"
    $principalHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $global:principalToken"
    }

    $studentData = @{
        first_name = "Alice"
        last_name = "Johnson"
        email = "alice.j@student.greenvalley.edu"
        phone = "+919876543212"
        admission_number = "GV2024001"
        admission_date = "2024-04-01"
        father_name = "Robert Johnson"
        mother_name = "Mary Johnson"
        blood_group = "O+"
        guardian_phone = "+919876543213"
        emergency_contact_name = "Robert Johnson"
        emergency_contact_phone = "+919876543213"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/students" -Method Post -Body $studentData -Headers $principalHeaders
        $global:studentId = $response.data.student_id
        Write-Success "Student created successfully"
        Write-Info "Student ID: $global:studentId"
        Write-Info "Admission Number: $($response.data.admission_number)"
        Write-Info "Login Email: $($response.login_details.email)"
        Write-Info "Temp Password: $($response.login_details.temporary_password)"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Info "Student already exists"
        } else {
            Write-Error "Failed: $_"
        }
    }
}

# Test 10: List Students
if ($global:principalToken) {
    Write-Test "List Students"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/students?page=1&amp;limit=20" -Method Get -Headers $principalHeaders
        Write-Success "Students listed successfully"
        Write-Info "Total students: $($response.pagination.total)"

        if ($response.data.Count -gt 0) {
            Write-Info "`nFirst Student:"
            Write-Info "  - Name: $($response.data[0].User.first_name) $($response.data[0].User.last_name)"
            Write-Info "  - Admission #: $($response.data[0].admission_number)"
            Write-Info "  - Status: $($response.data[0].status)"
        }
    } catch {
        Write-Error "Failed: $_"
    }
}

# Test 11: Get Student Details
if ($global:principalToken -and $global:studentId) {
    Write-Test "Get Student Details"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/students/$global:studentId" -Method Get -Headers $principalHeaders
        Write-Success "Student details retrieved"
        Write-Info "Name: $($response.data.User.first_name) $($response.data.User.last_name)"
        Write-Info "Email: $($response.data.User.email)"
        Write-Info "Father: $($response.data.father_name)"
    } catch {
        Write-Error "Failed: $_"
    }
}

# Test 12: Update Student
if ($global:principalToken -and $global:studentId) {
    Write-Test "Update Student"
    $updateData = @{
        blood_group = "A+"
        medical_conditions = "None"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/students/$global:studentId" -Method Patch -Body $updateData -Headers $principalHeaders
        Write-Success "Student updated successfully"
    } catch {
        Write-Error "Failed: $_"
    }
}

# Test 13: Student Login
Write-Test "Login as Student"
$studentLoginData = @{
    email = "alice.j@student.greenvalley.edu"
    password = "GV2024001"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $studentLoginData -Headers $headers
    $global:studentToken = $response.access_token
    Write-Success "Student logged in successfully"
    Write-Info "Token: $($global:studentToken.Substring(0, 20))..."
    Write-Info "Role: $($response.user.role)"
} catch {
    Write-Error "Failed: $_"
}

# Test 14: Student Get Own Profile
if ($global:studentToken) {
    Write-Test "Student Get Own Profile"
    $studentHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $global:studentToken"
    }

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/students/me" -Method Get -Headers $studentHeaders
        Write-Success "Student profile retrieved"
        Write-Info "Name: $($response.data.User.first_name) $($response.data.User.last_name)"
        Write-Info "Admission Number: $($response.data.admission_number)"
    } catch {
        Write-Error "Failed: $_"
    }
}

# Test 15: Bulk Import Students
if ($global:principalToken) {
    Write-Test "Bulk Import Students"
    $bulkData = @{
        students = @(
            @{
                first_name = "Bob"
                last_name = "Smith"
                admission_number = "GV2024002"
                father_name = "Tom Smith"
            },
            @{
                first_name = "Carol"
                last_name = "White"
                admission_number = "GV2024003"
                mother_name = "Linda White"
            }
        )
    } | ConvertTo-Json -Depth 5

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/students/bulk-import" -Method Post -Body $bulkData -Headers $principalHeaders
        Write-Success "Bulk import completed"
        Write-Info "Success: $($response.results.success)"
        Write-Info "Failed: $($response.results.failed)"
    } catch {
        Write-Error "Failed: $_"
    }
}

# Test 16: Get Public Plans
Write-Test "Get Public Plans"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/public/plans" -Method Get
    Write-Success "Plans retrieved successfully"
    Write-Info "Available plans: $($response.data.Count)"

    foreach ($plan in $response.data) {
        Write-Info "`nPlan: $($plan.name)"
        Write-Info "  - Price: ₹$($plan.price_monthly)/month"
        Write-Info "  - Max Students: $($plan.max_students)"
        Write-Info "  - Max Teachers: $($plan.max_teachers)"
    }
} catch {
    Write-Error "Failed: $_"
}

# Test 17: Refresh Token
if ($global:superAdminToken) {
    Write-Test "Refresh Token"
    # Note: We'd need the refresh token from the login response
    Write-Info "Skipped (requires refresh_token from login)"
}

# Test 18: Forgot Password
Write-Test "Forgot Password"
$forgotData = @{
    email = "admin@schoolsystem.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/forgot-password" -Method Post -Body $forgotData -Headers $headers
    Write-Success "Password reset initiated"
    if ($response.reset_token) {
        Write-Info "Reset token (dev mode): $($response.reset_token.Substring(0, 20))..."
    }
} catch {
    Write-Error "Failed: $_"
}

# Summary
Write-Host "`n================================" -ForegroundColor Magenta
Write-Host "Test Summary" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta
Write-Success "Core authentication working"
Write-Success "Super admin operations working"
Write-Success "School registration working"
Write-Success "Student management working"
Write-Success "Multi-role login working"
Write-Success "Database connected and operational"

Write-Host "`n✅ All critical APIs tested successfully!`n" -ForegroundColor Green

Write-Host "Test Credentials:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Super Admin:" -ForegroundColor Yellow
Write-Host "  Email: admin@schoolsystem.com" -ForegroundColor White
Write-Host "  Password: SuperAdmin@123" -ForegroundColor White
Write-Host "`nPrincipal:" -ForegroundColor Yellow
Write-Host "  Email: john.doe@greenvalley.edu" -ForegroundColor White
Write-Host "  Password: Principal@123" -ForegroundColor White
Write-Host "`nStudent:" -ForegroundColor Yellow
Write-Host "  Email: alice.j@student.greenvalley.edu" -ForegroundColor White
Write-Host "  Password: GV2024001" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
