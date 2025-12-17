# MySQL Workbench Database Connection Guide

This guide will help you connect MySQL Workbench to your Telecom Application databases and verify the data.

## 📋 Database Connection Details

Your application uses **MySQL 8.0** running in Docker containers. Each microservice has its own database:

| Service | Database Name | Host | Port | Username | Password |
|---------|--------------|------|------|----------|----------|
| **Catalog** | `catalogdb` | `127.0.0.1` | `3316` | `root` | `YourStrongPassword123!` |
| **Billing** | `billingdb` | `127.0.0.1` | `3317` | `root` | `YourStrongPassword123!` |
| **Customer** | `customerdb` | `127.0.0.1` | `3318` | `root` | `YourStrongPassword123!` |
| **Provisioning** | `provisioningdb` | `127.0.0.1` | `3319` | `root` | `YourStrongPassword123!` |
| **Identity** | `identitydb` | `localhost` | `3320` | `identityuser` | `IdentityPass123!` |

## 🔧 Step-by-Step: Connect MySQL Workbench

### Step 1: Open MySQL Workbench
1. Launch **MySQL Workbench** on your computer
2. You'll see the home screen with existing connections (if any)

### Step 2: Create New Connection for Catalog Database

1. Click the **"+"** icon next to "MySQL Connections" to create a new connection

2. Fill in the connection details:
   ```
   Connection Name: Telecom - Catalog DB
   Connection Method: Standard (TCP/IP)
   Hostname: 127.0.0.1
   Port: 3316
   Username: root
   Password: Click "Store in Vault..." and enter: YourStrongPassword123!
   Default Schema: catalogdb
   ```

3. Click **"Test Connection"** to verify
   - You should see: "Successfully made the MySQL connection"
   - If you get an error, make sure Docker containers are running

4. Click **"OK"** to save the connection

### Step 3: Repeat for Other Databases

Create connections for the other databases using the same steps but with different details:

**Billing Database:**
```
Connection Name: Telecom - Billing DB
Hostname: 127.0.0.1
Port: 3317
Username: root
Password: YourStrongPassword123!
Default Schema: billingdb
```

**Customer Database:**
```
Connection Name: Telecom - Customer DB
Hostname: 127.0.0.1
Port: 3318
Username: root
Password: YourStrongPassword123!
Default Schema: customerdb
```

**Provisioning Database:**
```
Connection Name: Telecom - Provisioning DB
Hostname: 127.0.0.1
Port: 3319
Username: root
Password: YourStrongPassword123!
Default Schema: provisioningdb
```

**Identity Database:**
```
Connection Name: Telecom - Identity DB
Hostname: localhost
Port: 3320
Username: identityuser
Password: IdentityPass123!
Default Schema: identitydb
```

## 🔍 Verify Database Data

### Connect to Catalog Database

1. Double-click the **"Telecom - Catalog DB"** connection
2. In the left sidebar, expand **"catalogdb"** → **"Tables"**
3. You should see:
   - `Products`
   - `TariffPlans`
   - `__EFMigrationsHistory`

### Query Catalog Products

Run this query to see all products:

```sql
-- View all products in the catalog
SELECT 
    Id,
    Name,
    Description,
    ProductCode,
    Price,
    Category,
    IsActive,
    CreatedAt
FROM catalogdb.Products
WHERE IsDeleted = 0
ORDER BY CreatedAt DESC;
```

**Expected Results:** You should see 2 seeded products:
- "Core Mobile Plan" (Category: 1 = Mobile)
- "Unlimited Home Internet" (Category: 2 = Internet)

### Query Tariff Plans

```sql
-- View all tariff plans
SELECT 
    Id,
    Name,
    Description,
    MonthlyFee,
    DataLimitGB,
    MinutesLimit,
    SmsLimit,
    ProductId,
    IsActive
FROM catalogdb.TariffPlans
WHERE IsDeleted = 0;
```

### Connect to Billing Database

1. Double-click the **"Telecom - Billing DB"** connection
2. Expand **"billingdb"** → **"Tables"**
3. You should see:
   - `Invoices`
   - `InvoiceItems`
   - `Payments`
   - `__EFMigrationsHistory`

### Query Billing Data

```sql
-- View all invoices with their items
SELECT 
    i.Id,
    i.InvoiceNumber,
    i.CustomerId,
    i.InvoiceDate,
    i.DueDate,
    i.TotalAmount,
    i.Status,
    COUNT(ii.Id) as ItemCount
FROM billingdb.Invoices i
LEFT JOIN billingdb.InvoiceItems ii ON i.Id = ii.InvoiceId
GROUP BY i.Id
ORDER BY i.InvoiceDate DESC;
```

```sql
-- View invoice items details
SELECT 
    ii.Id,
    i.InvoiceNumber,
    ii.Description,
    ii.Quantity,
    ii.UnitPrice,
    ii.Total
FROM billingdb.InvoiceItems ii
JOIN billingdb.Invoices i ON ii.InvoiceId = i.Id
ORDER BY i.InvoiceDate DESC;
```

```sql
-- View payments
SELECT 
    p.Id,
    i.InvoiceNumber,
    p.PaymentReference,
    p.Amount,
    p.PaymentDate,
    p.Method,
    p.Status
FROM billingdb.Payments p
JOIN billingdb.Invoices i ON p.InvoiceId = i.Id
ORDER BY p.PaymentDate DESC;
```

## 🧪 Test Data Integrity

### Verify Catalog-Frontend Integration

After creating a product through the admin dashboard at `http://localhost:3000/dashboard/catalog`:

```sql
-- Check if new product was created
SELECT 
    Name,
    ProductCode,
    Price,
    Category,
    IsActive,
    CreatedAt
FROM catalogdb.Products
WHERE IsDeleted = 0
ORDER BY CreatedAt DESC
LIMIT 5;
```

### Verify Product Categories

```sql
-- Count products by category
SELECT 
    CASE Category
        WHEN 1 THEN 'Mobile'
        WHEN 2 THEN 'Internet'
        WHEN 3 THEN 'Television'
        WHEN 4 THEN 'Bundle'
        WHEN 5 THEN 'Device'
        WHEN 6 THEN 'Accessory'
        ELSE 'Unknown'
    END as CategoryName,
    COUNT(*) as ProductCount
FROM catalogdb.Products
WHERE IsDeleted = 0
GROUP BY Category;
```

## 🛠️ Troubleshooting

### Connection Failed Error

**Problem:** "Can't connect to MySQL server on '127.0.0.1'"

**Solutions:**
1. Verify Docker containers are running:
   ```powershell
   docker ps
   ```
   You should see containers: `catalog-db`, `billing-db`, `customer-db`, `provisioning-db`

2. If containers are not running, start them:
   ```powershell
   docker-compose up -d catalog-db billing-db customer-db provisioning-db
   ```

3. Check if ports are listening:
   ```powershell
   netstat -ano | findstr "3316 3317 3318 3319 3320"
   ```

### Access Denied Error

**Problem:** "Access denied for user 'root'@'localhost'"

**Solution:** Double-check the password in MySQL Workbench:
- For Catalog/Billing/Customer/Provisioning: `YourStrongPassword123!`
- For Identity: Username `identityuser`, Password `IdentityPass123!`

### Empty Tables

**Problem:** Tables exist but have no data

**Solution:** The application seeds data on first run. Make sure you've started the backend services:
```powershell
cd c:\Lora\hyperlink\src\services\Catalog\Catalog.API
dotnet run --urls=http://localhost:8001
```

Check the console output for: "Catalog database migrated and seeded successfully."

## 📊 Useful Queries for Development

### View Database Schema

```sql
-- Show all tables in catalog database
SHOW TABLES FROM catalogdb;

-- Describe Products table structure
DESCRIBE catalogdb.Products;

-- View indexes on Products table
SHOW INDEX FROM catalogdb.Products;
```

### Monitor Data Changes

```sql
-- Products created in the last hour
SELECT * FROM catalogdb.Products
WHERE CreatedAt > DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY CreatedAt DESC;

-- Products updated recently
SELECT * FROM catalogdb.Products
WHERE UpdatedAt > DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY UpdatedAt DESC;
```

### Check Migration History

```sql
-- View applied migrations
SELECT * FROM catalogdb.__EFMigrationsHistory
ORDER BY MigrationId;

SELECT * FROM billingdb.__EFMigrationsHistory
ORDER BY MigrationId;
```

## 🎯 Next Steps

1. **Create test data** through the admin dashboard
2. **Verify data appears** in MySQL Workbench
3. **Check public pages** display the new data
4. **Test CRUD operations** and confirm database updates

## 📝 Notes

- All databases use **UTC timestamps** for `CreatedAt` and `UpdatedAt` fields
- Soft deletes are implemented - records have `IsDeleted` flag instead of being physically deleted
- Foreign key relationships are enforced between tables
- Entity Framework Core manages migrations automatically on application startup
