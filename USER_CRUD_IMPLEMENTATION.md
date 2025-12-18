# User CRUD Implementation Summary

## Overview
This document describes the complete CRUD implementation for registered users and user information management.

## Backend Implementation

### 1. Database Schema
- **UserInformation Table**: Created with the following fields:
  - Id (Guid, Primary Key)
  - UserId (Guid, Foreign Key to Users table, Unique)
  - FirstName, LastName, Gender, PhoneNumber
  - DateOfBirth, Address, City, State, Country, PostalCode
  - CreatedAt, UpdatedAt

### 2. Backend Components Created

#### Domain Layer
- `UserInformation.cs` - Entity model

#### Application Layer
- **Interfaces**:
  - `IUserInformationRepository.cs` - Repository interface
- **DTOs**:
  - `UserInformationDto.cs`
  - `CreateUserInformationRequest.cs`
  - `UpdateUserInformationRequest.cs`
  - `UpdateUserRequest.cs`
  - `ChangePasswordRequest.cs`
- **Services**:
  - `UserInformationService.cs` - Business logic for user information CRUD
  - `UserManagementService.cs` - Extended with update, change password, and delete operations

#### Infrastructure Layer
- `UserInformationRepository.cs` - Data access implementation
- Database migration: `AddUserInformation`

### 3. API Endpoints

#### User Profile Endpoints (Authenticated Users)
- `GET /users/me` - Get current user data
- `PUT /users/me` - Update current user
- `POST /users/me/change-password` - Change password
- `DELETE /users/me` - Deactivate user account

#### User Information Endpoints (Authenticated Users)
- `GET /users/me/information` - Get user information
- `POST /users/me/information` - Create user information
- `PUT /users/me/information` - Update user information
- `DELETE /users/me/information` - Delete user information

#### Admin Endpoints
- `GET /admin/user-information` - Get all user information
- `GET /admin/user-information/{id}` - Get user information by ID
- `GET /admin/users/{userId}/information` - Get user information by user ID
- `PUT /admin/users/{userId}/information` - Update user information
- `DELETE /admin/users/{userId}/information` - Delete user information

## Frontend Implementation

### 1. Profile Page (`/profile`)
Located at: `src/web/src/pages/ProfilePage.tsx`

**Features**:
- **Personal Information Tab**:
  - View and edit user information (first name, last name, gender, phone, DOB, address, city, state, country, postal code)
  - Email displayed as read-only (verified)
  - Pre-fills existing data from registration
  - Supports null values for optional fields
  - Save and discard changes functionality
  - Loading states and error handling

- **Password Tab**:
  - Change password with current password verification
  - Password confirmation validation
  - Minimum length validation

- **User Avatar**:
  - Displays initials from first/last name or email
  - Shows user role (User/Admin)

- **Logout Functionality**

### 2. Admin User Information Management (`/dashboard/user-information`)
Located at: `src/web/src/pages/dashboard/UserInformationManagement.tsx`

**Features**:
- View all user information in a table
- Search functionality (by name or phone)
- Edit user information via modal dialog
- Delete user information
- Real-time updates after operations
- Success/error notifications

### 3. Configuration Updates
- **vite.config.ts**: Added proxy routes for `/users` and `/admin` endpoints
- **App.tsx**: Added route for admin user information management

## Database Migration

To apply the migration:
```bash
cd c:\Lora\hyperlink\src\services\identityservice
dotnet ef database update --project IdentityService.Infrastructure --startup-project identityservice.api
```

## Testing Instructions

### 1. Start Services
```bash
# Start Identity Service (port 5001)
cd c:\Lora\hyperlink\src\services\identityservice\identityservice.api
dotnet run

# Start Frontend (port 3000)
cd c:\Lora\hyperlink\src\web
npm run dev
```

### 2. Test User Profile CRUD

#### Create/Update Profile Information
1. Navigate to `http://localhost:3000/login`
2. Login with your credentials
3. Navigate to `http://localhost:3000/profile`
4. Fill in personal information fields
5. Click "Save Changes"
6. Verify success message appears
7. Refresh page to verify data persists

#### Change Password
1. On profile page, click "Login & Password" tab
2. Enter current password
3. Enter new password and confirm
4. Click "Change Password"
5. Verify success message
6. Logout and login with new password

#### Read Profile
1. Navigate to profile page
2. Verify all previously entered information is displayed
3. Verify email is shown as read-only with "Verified" badge

#### Update Profile
1. Modify any field
2. Click "Save Changes"
3. Verify updates are saved

#### Discard Changes
1. Modify fields
2. Click "Discard Changes"
3. Verify fields revert to original values

### 3. Test Admin User Information Management

#### Prerequisites
- Login as admin user (loralora@gmail.com or user with Admin role)

#### View All User Information
1. Navigate to `http://localhost:3000/dashboard/user-information`
2. Verify table displays all user information
3. Test search functionality

#### Edit User Information
1. Click edit icon on any user
2. Modify fields in modal
3. Click "Save Changes"
4. Verify success message and table updates

#### Delete User Information
1. Click delete icon on any user
2. Confirm deletion
3. Verify success message and user removed from table

## API Testing with curl

### Get Current User
```bash
curl -X GET http://localhost:5001/users/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --cookie "refreshToken=YOUR_REFRESH_TOKEN"
```

### Create User Information
```bash
curl -X POST http://localhost:5001/users/me/information \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  --cookie "refreshToken=YOUR_REFRESH_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-01-01T00:00:00Z",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001"
  }'
```

### Update User Information
```bash
curl -X PUT http://localhost:5001/users/me/information \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  --cookie "refreshToken=YOUR_REFRESH_TOKEN" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe"
  }'
```

### Get User Information
```bash
curl -X GET http://localhost:5001/users/me/information \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --cookie "refreshToken=YOUR_REFRESH_TOKEN"
```

### Change Password
```bash
curl -X POST http://localhost:5001/users/me/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  --cookie "refreshToken=YOUR_REFRESH_TOKEN" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123"
  }'
```

### Admin: Get All User Information
```bash
curl -X GET http://localhost:5001/admin/user-information \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  --cookie "refreshToken=ADMIN_REFRESH_TOKEN"
```

## Features Implemented

### User Features
✅ Create user information (first time)
✅ Read user information (view profile)
✅ Update user information (edit profile)
✅ Delete user information (optional)
✅ Change password
✅ Optional fields support (can be null)
✅ Pre-filled data from registration
✅ Email verification status display
✅ User avatar with initials
✅ Tab-based navigation (Personal Info / Password)
✅ Loading states and error handling
✅ Success notifications

### Admin Features
✅ View all user information
✅ Search user information
✅ Edit any user's information
✅ Delete user information
✅ Modal-based editing
✅ Real-time table updates

### Technical Features
✅ End-to-end database connection
✅ JWT authentication with refresh tokens
✅ HttpOnly cookies for security
✅ CORS configuration
✅ Axios interceptors for token refresh
✅ Proper error handling
✅ TypeScript type safety
✅ Responsive UI design
✅ Modern UI with Tailwind CSS

## Architecture

### Backend Stack
- .NET 10.0
- Entity Framework Core
- MySQL Database
- JWT Authentication
- Minimal API

### Frontend Stack
- React 18
- TypeScript
- Vite
- Axios
- React Router
- Tailwind CSS
- Lucide Icons

## Security Considerations
- JWT tokens stored in localStorage
- Refresh tokens in HttpOnly cookies
- Password hashing with BCrypt
- CORS enabled for specific origins
- Authorization checks on all protected endpoints
- Admin role verification for admin endpoints

## Notes
- All user information fields are optional except UserId
- Email cannot be changed from profile page (security)
- Password must be at least 6 characters
- Date of birth is stored as ISO 8601 format
- User deletion is soft delete (sets IsActive to false)
- Admin can manage all user information
- Frontend automatically refreshes tokens when expired
