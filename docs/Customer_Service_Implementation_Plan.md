# Customer Service Implementation Plan

## Overview
Complete implementation of Customer Service microservice with full CRUD functionality, database schema, backend logic, frontend UI (user + admin), and comprehensive tests.

## Architecture

### Database Schema (customerdb)

#### Customers Table
- CustomerId (GUID, PK)
- FirstName (string, 100)
- LastName (string, 100)
- Email (string, 255, unique)
- PhoneNumber (string, 20)
- DateOfBirth (DateTime?)
- Address (string, 500)
- City (string, 100)
- PostalCode (string, 20)
- Country (string, 100)
- CustomerType (enum: Individual, Business)
- CustomerSegment (enum: Retail, Enterprise)
- CreatedAt (DateTime)
- UpdatedAt (DateTime?)
- IsDeleted (bool)

#### Accounts Table
- AccountId (GUID, PK)
- CustomerId (GUID, FK)
- AccountNumber (string, 50, unique)
- AccountStatus (enum: Active, Suspended, Closed)
- Balance (decimal)
- CreditLimit (decimal)
- CreatedAt (DateTime)
- UpdatedAt (DateTime?)
- IsDeleted (bool)

#### Subscriptions Table
- SubscriptionId (GUID, PK)
- AccountId (GUID, FK)
- ProductId (GUID) - Reference to Catalog Service
- SubscriptionNumber (string, 50, unique)
- StartDate (DateTime)
- EndDate (DateTime?)
- Status (enum: Active, Suspended, Cancelled, Expired)
- AutoRenew (bool)
- CreatedAt (DateTime)
- UpdatedAt (DateTime?)
- IsDeleted (bool)

#### CustomerPreferences Table
- PreferenceId (GUID, PK)
- CustomerId (GUID, FK)
- NotificationEmail (bool)
- NotificationSMS (bool)
- NotificationPush (bool)
- BillingPreference (enum: Email, Mail, Both)
- Language (string, 10)
- Currency (string, 3)
- CreatedAt (DateTime)
- UpdatedAt (DateTime?)

### Backend Structure

#### Customer.Domain
- Entities/
  - Customer.cs
  - Account.cs
  - Subscription.cs
  - CustomerPreferences.cs
  - BaseEntity.cs
- Enums/
  - CustomerType.cs
  - CustomerSegment.cs
  - AccountStatus.cs
  - SubscriptionStatus.cs
  - BillingPreference.cs
- Repositories/
  - ICustomerRepository.cs
  - IAccountRepository.cs
  - ISubscriptionRepository.cs
  - ICustomerPreferencesRepository.cs

#### Customer.Application
- DTOs/
  - CustomerDto.cs
  - CreateCustomerDto.cs
  - UpdateCustomerDto.cs
  - AccountDto.cs
  - SubscriptionDto.cs
  - CustomerPreferencesDto.cs
- Services/
  - Interfaces/
    - ICustomerService.cs
    - IAccountService.cs
    - ISubscriptionService.cs
  - Implementation/
    - CustomerService.cs
    - AccountService.cs
    - SubscriptionService.cs
- Mappings/
  - MappingProfile.cs
- Validators/
  - CreateCustomerValidator.cs
  - UpdateCustomerValidator.cs

#### Customer.Infrastructure
- Data/
  - CustomerDbContext.cs
  - Configurations/
    - CustomerConfiguration.cs
    - AccountConfiguration.cs
    - SubscriptionConfiguration.cs
    - CustomerPreferencesConfiguration.cs
- Repositories/
  - CustomerRepository.cs
  - AccountRepository.cs
  - SubscriptionRepository.cs
  - CustomerPreferencesRepository.cs
- Migrations/
  - (EF Core migrations)

#### Customer.API
- Controllers/
  - CustomersController.cs
  - AccountsController.cs
  - SubscriptionsController.cs
  - CustomerPreferencesController.cs
- Program.cs
- appsettings.json

### Frontend Structure

#### Services
- src/web/src/services/
  - customerService.ts
  - accountService.ts
  - subscriptionService.ts

#### User Pages
- src/web/src/pages/profile/
  - MyProfile.tsx (view/edit profile)
  - MySubscriptions.tsx (view subscriptions)
  - AccountDetails.tsx (view account info)
  - Preferences.tsx (manage preferences)

#### Admin Pages
- src/web/src/pages/dashboard/
  - CustomerManagement.tsx (list, search, filter)
  - CustomerDetails.tsx (view/edit customer)
  - AccountManagement.tsx (manage accounts)
  - SubscriptionManagement.tsx (manage subscriptions)

### API Endpoints

#### Customers
- GET /api/customers - Get all customers (admin)
- GET /api/customers/{id} - Get customer by ID
- POST /api/customers - Create customer
- PUT /api/customers/{id} - Update customer
- DELETE /api/customers/{id} - Soft delete customer
- GET /api/customers/search?query={query} - Search customers
- GET /api/customers/me - Get current user's customer profile

#### Accounts
- GET /api/accounts/customer/{customerId} - Get accounts by customer
- GET /api/accounts/{id} - Get account by ID
- POST /api/accounts - Create account
- PUT /api/accounts/{id} - Update account
- PATCH /api/accounts/{id}/status - Update account status
- GET /api/accounts/{id}/balance - Get account balance

#### Subscriptions
- GET /api/subscriptions/account/{accountId} - Get subscriptions by account
- GET /api/subscriptions/{id} - Get subscription by ID
- POST /api/subscriptions - Create subscription
- PUT /api/subscriptions/{id} - Update subscription
- PATCH /api/subscriptions/{id}/status - Update subscription status
- DELETE /api/subscriptions/{id} - Cancel subscription
- GET /api/subscriptions/active - Get active subscriptions

#### Preferences
- GET /api/preferences/customer/{customerId} - Get customer preferences
- PUT /api/preferences/customer/{customerId} - Update preferences

### Tests

#### Unit Tests
- Customer.Application.Tests/
  - Services/
    - CustomerServiceTests.cs
    - AccountServiceTests.cs
    - SubscriptionServiceTests.cs
  - Validators/
    - CreateCustomerValidatorTests.cs

#### Integration Tests
- Customer.API.Tests/
  - Controllers/
    - CustomersControllerTests.cs
    - AccountsControllerTests.cs
    - SubscriptionsControllerTests.cs
  - Infrastructure/
    - CustomerRepositoryTests.cs

## Implementation Steps

1. ✅ Create database schema and entities
2. ✅ Create DTOs and mapping profiles
3. ✅ Create repositories
4. ✅ Create business logic services
5. ✅ Create API controllers
6. ✅ Create EF Core migration
7. ✅ Register services in DI
8. ✅ Create frontend service layer
9. ✅ Create user profile pages
10. ✅ Create admin management pages
11. ✅ Write unit tests
12. ✅ Write integration tests
13. ✅ End-to-end testing

## Success Criteria

- ✅ Database tables created with proper relationships
- ✅ All CRUD operations working for customers, accounts, subscriptions
- ✅ User can view and edit their profile
- ✅ User can view their subscriptions and account details
- ✅ Admin can manage all customers with full CRUD
- ✅ Admin can manage accounts and subscriptions
- ✅ All unit tests passing (>80% coverage)
- ✅ All integration tests passing
- ✅ API documented with Swagger
- ✅ Frontend properly integrated with backend
