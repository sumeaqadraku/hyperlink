# Role Management Guide

## Available Roles
- **User** - Default role for all new registrations
- **Admin** - Administrator with elevated permissions

## How to Create the First Admin User

Since only admins can promote other users to admin, you need to manually set the first admin user directly in the database:

### Method 1: Using MySQL Command Line

```sql
-- Connect to your database
USE identitydb;

-- Find the user ID you want to promote
SELECT Id, Email, Role FROM Users;

-- Update the user's role to Admin
UPDATE Users 
SET Role = 'Admin', UpdatedAt = UTC_TIMESTAMP() 
WHERE Email = 'your-admin@example.com';
```

### Method 2: Using MySQL Workbench or phpMyAdmin
1. Connect to the `identitydb` database
2. Open the `Users` table
3. Find the user you want to make admin
4. Edit the `Role` column from `User` to `Admin`
5. Update the `UpdatedAt` column to the current timestamp

## API Endpoints

### Update User Role (Admin Only)
**Endpoint:** `PUT /admin/users/{userId}/role`

**Authorization:** Requires Admin role

**Request:**
```json
{
  "role": "Admin"
}
```

**Example:**
```bash
# Get your admin token first by logging in
curl -X POST http://localhost:5078/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123"
  }'

# Use the token to promote a user
curl -X PUT http://localhost:5078/admin/users/USER_ID_HERE/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "role": "Admin"
  }'
```

**Response:**
```json
{
  "message": "Role updated successfully"
}
```

### Get User Details (Admin Only)
**Endpoint:** `GET /admin/users/{userId}`

**Authorization:** Requires Admin role

**Example:**
```bash
curl -X GET http://localhost:5078/admin/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "role": "User",
  "isActive": true,
  "createdAt": "2025-12-16T14:30:00Z",
  "updatedAt": "2025-12-16T14:30:00Z"
}
```

## Workflow

1. **Register first user** via `POST /auth/register`
2. **Manually promote** the first user to Admin using database SQL
3. **Login as admin** to get admin JWT token
4. **Use admin token** to promote other users to Admin role via API

## Valid Roles
- `User`
- `Admin`

Case-insensitive, but stored as capitalized format.
