# Catalog Service - Detailed Design Document (DDD)

> **Document Version:** 1.0  
> **Generated:** December 18, 2025  
> **Architecture Pattern:** Clean Architecture with Domain-Driven Design (DDD)

---

## Table of Contents

1. [Service Overview](#1-service-overview)
2. [Package Structure](#2-package-structure)
3. [Domain Layer](#3-domain-layer)
4. [Application Layer](#4-application-layer)
5. [Infrastructure Layer](#5-infrastructure-layer)
6. [API Layer](#6-api-layer)
7. [External Dependencies](#7-external-dependencies)
8. [Class Relationships](#8-class-relationships)

---

## 1. Service Overview

The **Catalog Service** is a microservice responsible for managing the product catalog, tariff plans, and offer details for a telecommunications platform.

### Technology Stack
| Component | Technology |
|-----------|------------|
| Language | C# (.NET) |
| Database | MySQL |
| ORM | Entity Framework Core |
| Mapping | AutoMapper |
| Validation | FluentValidation |

---

## 2. Package Structure

```
Catalog/
├── Catalog.API/                    # Presentation Layer
│   ├── Controllers/
│   ├── Middleware/
│   └── Program.cs
├── Catalog.Application/            # Application Layer
│   ├── DTOs/
│   ├── Services/
│   ├── Mappings/
│   └── Validators/
├── Catalog.Domain/                 # Domain Layer
│   ├── Entities/
│   ├── Enums/
│   ├── Interfaces/
│   └── Exceptions/
└── Catalog.Infrastructure/         # Infrastructure Layer
    ├── Data/
    ├── Repositories/
    └── Migrations/
```

---

## 3. Domain Layer

### 3.1 Entities

```
┌──────────────────────────────────────────────┐
│                  Product                     │
│           <<Entity / AggregateRoot>>         │
├──────────────────────────────────────────────┤
│ - id: Guid                                   │
│ - name: String                               │
│ - description: String                        │
│ - productCode: String                        │
│ - price: Decimal                             │
│ - isActive: Boolean                          │
│ - category: ProductCategory                  │
│ - imageUrl: String?                          │
│ - tariffPlans: ICollection<TariffPlan>       │
│ - createdAt: DateTime                        │
│ - updatedAt: DateTime?                       │
│ - isDeleted: Boolean                         │
├──────────────────────────────────────────────┤
│ + Product(name, description, productCode,    │
│           price, category)                   │
│ + SetName(name: String): void                │
│ + SetDescription(description: String): void  │
│ + SetProductCode(productCode: String): void  │
│ + SetPrice(price: Decimal): void             │
│ + SetImageUrl(imageUrl: String?): void       │
│ + Activate(): void                           │
│ + Deactivate(): void                         │
│ + MarkAsUpdated(): void                      │
│ + MarkAsDeleted(): void                      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│                 TariffPlan                   │
│           <<Entity / AggregateRoot>>         │
├──────────────────────────────────────────────┤
│ - id: Guid                                   │
│ - name: String                               │
│ - description: String                        │
│ - monthlyFee: Decimal                        │
│ - dataLimitGB: Int                           │
│ - minutesLimit: Int                          │
│ - smsLimit: Int                              │
│ - isUnlimitedData: Boolean                   │
│ - isActive: Boolean                          │
│ - contractDurationMonths: Int                │
│ - productId: Guid?                           │
│ - product: Product?                          │
│ - createdAt: DateTime                        │
│ - updatedAt: DateTime?                       │
│ - isDeleted: Boolean                         │
├──────────────────────────────────────────────┤
│ + TariffPlan(name, description, monthlyFee,  │
│              dataLimitGB, minutesLimit,      │
│              smsLimit, contractDurationMonths)│
│ + SetName(name: String): void                │
│ + SetDescription(description: String): void  │
│ + SetMonthlyFee(monthlyFee: Decimal): void   │
│ + SetUnlimitedData(isUnlimited: Boolean): void│
│ + AssignToProduct(productId: Guid): void     │
│ + Activate(): void                           │
│ + Deactivate(): void                         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│                OfferDetails                  │
│           <<Entity / AggregateRoot>>         │
├──────────────────────────────────────────────┤
│ - id: Guid                                   │
│ - productId: Guid                            │
│ - billingCycle: String                       │
│ - detailedDescription: String                │
│ - speedBandwidth: String?                    │
│ - dataLimit: String?                         │
│ - technology: String?                        │
│ - contractDurationMonths: Int?               │
│ - installationType: String?                  │
│ - isAvailable: Boolean                       │
│ - coverageArea: String?                      │
│ - availableFrom: DateTime?                   │
│ - availableUntil: DateTime?                  │
│ - includedServices: String?                  │
│ - promotions: String?                        │
│ - bonusFeatures: String?                     │
│ - eligibleCustomers: String?                 │
│ - minimumAge: Int?                           │
│ - product: Product?                          │
│ - createdAt: DateTime                        │
│ - updatedAt: DateTime?                       │
│ - isDeleted: Boolean                         │
├──────────────────────────────────────────────┤
│ + OfferDetails(productId, billingCycle,      │
│                detailedDescription)          │
│ + UpdateBasicInfo(billingCycle,              │
│                   detailedDescription): void │
│ + UpdateTechnicalSpecs(speedBandwidth,       │
│     dataLimit, technology,                   │
│     contractDurationMonths,                  │
│     installationType): void                  │
│ + UpdateAvailability(isAvailable,            │
│     coverageArea, availableFrom,             │
│     availableUntil): void                    │
│ + UpdateBenefits(includedServices,           │
│     promotions, bonusFeatures): void         │
│ + UpdateEligibility(eligibleCustomers,       │
│                     minimumAge): void        │
│ + SetAvailability(isAvailable: Boolean): void│
└──────────────────────────────────────────────┘
```

### 3.2 Enums

```
┌──────────────────────────────────────────────┐
│              ProductCategory                 │
│                 <<Enum>>                     │
├──────────────────────────────────────────────┤
│   Mobile = 1                                 │
│   Internet = 2                               │
│   Television = 3                             │
│   Bundle = 4                                 │
│   Device = 5                                 │
│   Accessory = 6                              │
└──────────────────────────────────────────────┘
```

### 3.3 Repository Interfaces

```
┌──────────────────────────────────────────────┐
│             IProductRepository               │
│                <<Interface>>                 │
├──────────────────────────────────────────────┤
│ + GetByIdAsync(id: Guid,                     │
│     cancellationToken): Task<Product?>       │
│ + GetByProductCodeAsync(productCode: String, │
│     cancellationToken): Task<Product?>       │
│ + GetAllAsync(cancellationToken):            │
│     Task<IEnumerable<Product>>               │
│ + GetActiveProductsAsync(cancellationToken): │
│     Task<IEnumerable<Product>>               │
│ + GetByCategoryAsync(category,               │
│     cancellationToken):                      │
│     Task<IEnumerable<Product>>               │
│ + AddAsync(product: Product,                 │
│     cancellationToken): Task                 │
│ + Update(product: Product): void             │
│ + Delete(product: Product): void             │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│            ITariffPlanRepository             │
│                <<Interface>>                 │
├──────────────────────────────────────────────┤
│ + GetByIdAsync(id: Guid,                     │
│     cancellationToken): Task<TariffPlan?>    │
│ + GetAllAsync(cancellationToken):            │
│     Task<IEnumerable<TariffPlan>>            │
│ + GetActiveAsync(cancellationToken):         │
│     Task<IEnumerable<TariffPlan>>            │
│ + GetByProductIdAsync(productId: Guid,       │
│     cancellationToken):                      │
│     Task<IEnumerable<TariffPlan>>            │
│ + AddAsync(tariffPlan: TariffPlan,           │
│     cancellationToken): Task                 │
│ + Update(tariffPlan: TariffPlan): void       │
│ + Delete(tariffPlan: TariffPlan): void       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│          IOfferDetailsRepository             │
│                <<Interface>>                 │
├──────────────────────────────────────────────┤
│ + GetByIdAsync(id: Guid,                     │
│     cancellationToken): Task<OfferDetails?>  │
│ + GetByProductIdAsync(productId: Guid,       │
│     cancellationToken): Task<OfferDetails?>  │
│ + GetAllAsync(cancellationToken):            │
│     Task<IEnumerable<OfferDetails>>          │
│ + GetAvailableAsync(cancellationToken):      │
│     Task<IEnumerable<OfferDetails>>          │
│ + AddAsync(offerDetails: OfferDetails,       │
│     cancellationToken): Task                 │
│ + Update(offerDetails: OfferDetails): void   │
│ + Delete(offerDetails: OfferDetails): void   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│                IUnitOfWork                   │
│           <<Interface / IDisposable>>        │
├──────────────────────────────────────────────┤
│ + Products: IProductRepository               │
│ + TariffPlans: ITariffPlanRepository         │
├──────────────────────────────────────────────┤
│ + SaveChangesAsync(cancellationToken):       │
│     Task<int>                                │
│ + BeginTransactionAsync(cancellationToken):  │
│     Task                                     │
│ + CommitTransactionAsync(cancellationToken): │
│     Task                                     │
│ + RollbackTransactionAsync(cancellationToken)│
│     : Task                                   │
│ + Dispose(): void                            │
└──────────────────────────────────────────────┘
```

### 3.4 Exceptions

```
┌──────────────────────────────────────────────┐
│          ProductNotFoundException            │
│              <<Exception>>                   │
├──────────────────────────────────────────────┤
│ - code: String = "NOT_FOUND"                 │
├──────────────────────────────────────────────┤
│ + ProductNotFoundException(id: Guid)         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│         TariffPlanNotFoundException          │
│              <<Exception>>                   │
├──────────────────────────────────────────────┤
│ - code: String = "NOT_FOUND"                 │
├──────────────────────────────────────────────┤
│ + TariffPlanNotFoundException(id: Guid)      │
└──────────────────────────────────────────────┘
```

---

## 4. Application Layer

### 4.1 DTOs

```
┌──────────────────────────────────────────────┐
│                 ProductDto                   │
│                  <<DTO>>                     │
├──────────────────────────────────────────────┤
│ + Id: Guid                                   │
│ + Name: String                               │
│ + Description: String                        │
│ + ProductCode: String                        │
│ + Price: Decimal                             │
│ + IsActive: Boolean                          │
│ + Category: ProductCategory                  │
│ + ServiceTypeId: Guid?                       │
│ + ServiceTypeName: String?                   │
│ + ImageUrl: String?                          │
│ + CreatedAt: DateTime                        │
│ + UpdatedAt: DateTime?                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│             CreateProductDto                 │
│                  <<DTO>>                     │
├──────────────────────────────────────────────┤
│ + Name: String                               │
│ + Description: String                        │
│ + ProductCode: String                        │
│ + Price: Decimal                             │
│ + Category: ProductCategory                  │
│ + ServiceTypeId: Guid?                       │
│ + ImageUrl: String?                          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│             UpdateProductDto                 │
│                  <<DTO>>                     │
├──────────────────────────────────────────────┤
│ + Name: String                               │
│ + Description: String                        │
│ + Price: Decimal                             │
│ + ServiceTypeId: Guid?                       │
│ + ImageUrl: String?                          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│               TariffPlanDto                  │
│                  <<DTO>>                     │
├──────────────────────────────────────────────┤
│ + Id: Guid                                   │
│ + Name: String                               │
│ + Description: String                        │
│ + MonthlyFee: Decimal                        │
│ + DataLimitGB: Int                           │
│ + MinutesLimit: Int                          │
│ + SMSLimit: Int                              │
│ + IsUnlimitedData: Boolean                   │
│ + IsActive: Boolean                          │
│ + ContractDurationMonths: Int                │
│ + ProductId: Guid?                           │
│ + CreatedAt: DateTime                        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│            CreateTariffPlanDto               │
│                  <<DTO>>                     │
├──────────────────────────────────────────────┤
│ + Name: String                               │
│ + Description: String                        │
│ + MonthlyFee: Decimal                        │
│ + DataLimitGB: Int                           │
│ + MinutesLimit: Int                          │
│ + SMSLimit: Int                              │
│ + IsUnlimitedData: Boolean                   │
│ + ContractDurationMonths: Int                │
│ + ProductId: Guid?                           │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│            UpdateTariffPlanDto               │
│                  <<DTO>>                     │
├──────────────────────────────────────────────┤
│ + Name: String                               │
│ + Description: String                        │
│ + MonthlyFee: Decimal                        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│              OfferDetailsDto                 │
│                  <<DTO>>                     │
├──────────────────────────────────────────────┤
│ + Id: Guid                                   │
│ + ProductId: Guid                            │
│ + BillingCycle: String                       │
│ + DetailedDescription: String                │
│ + SpeedBandwidth: String?                    │
│ + DataLimit: String?                         │
│ + Technology: String?                        │
│ + ContractDurationMonths: Int?               │
│ + InstallationType: String?                  │
│ + IsAvailable: Boolean                       │
│ + CoverageArea: String?                      │
│ + AvailableFrom: DateTime?                   │
│ + AvailableUntil: DateTime?                  │
│ + IncludedServices: String?                  │
│ + Promotions: String?                        │
│ + BonusFeatures: String?                     │
│ + EligibleCustomers: String?                 │
│ + MinimumAge: Int?                           │
│ + CreatedAt: DateTime                        │
│ + UpdatedAt: DateTime?                       │
└──────────────────────────────────────────────┘
```

### 4.2 Service Interfaces

```
┌──────────────────────────────────────────────┐
│              IProductService                 │
│                <<Interface>>                 │
├──────────────────────────────────────────────┤
│ + GetByIdAsync(id: Guid, cancellationToken): │
│     Task<Result<ProductDto>>                 │
│ + GetAllAsync(cancellationToken):            │
│     Task<Result<IEnumerable<ProductDto>>>    │
│ + GetActiveProductsAsync(cancellationToken): │
│     Task<Result<IEnumerable<ProductDto>>>    │
│ + GetByCategoryAsync(category,               │
│     cancellationToken):                      │
│     Task<Result<IEnumerable<ProductDto>>>    │
│ + CreateAsync(dto: CreateProductDto,         │
│     cancellationToken):                      │
│     Task<Result<ProductDto>>                 │
│ + UpdateAsync(id: Guid,                      │
│     dto: UpdateProductDto,                   │
│     cancellationToken):                      │
│     Task<Result<ProductDto>>                 │
│ + DeleteAsync(id: Guid, cancellationToken):  │
│     Task<Result>                             │
│ + ActivateAsync(id: Guid, cancellationToken):│
│     Task<Result>                             │
│ + DeactivateAsync(id: Guid,                  │
│     cancellationToken): Task<Result>         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│            ITariffPlanService                │
│                <<Interface>>                 │
├──────────────────────────────────────────────┤
│ + GetByIdAsync(id: Guid, cancellationToken): │
│     Task<Result<TariffPlanDto>>              │
│ + GetAllAsync(cancellationToken):            │
│     Task<Result<IEnumerable<TariffPlanDto>>> │
│ + GetActiveAsync(cancellationToken):         │
│     Task<Result<IEnumerable<TariffPlanDto>>> │
│ + CreateAsync(dto: CreateTariffPlanDto,      │
│     cancellationToken):                      │
│     Task<Result<TariffPlanDto>>              │
│ + UpdateAsync(id: Guid,                      │
│     dto: UpdateTariffPlanDto,                │
│     cancellationToken):                      │
│     Task<Result<TariffPlanDto>>              │
│ + DeleteAsync(id: Guid, cancellationToken):  │
│     Task<Result>                             │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│           IOfferDetailsService               │
│                <<Interface>>                 │
├──────────────────────────────────────────────┤
│ + GetByIdAsync(id: Guid, cancellationToken): │
│     Task<Result<OfferDetailsDto>>            │
│ + GetByProductIdAsync(productId: Guid,       │
│     cancellationToken):                      │
│     Task<Result<OfferDetailsDto>>            │
│ + GetAllAsync(cancellationToken):            │
│     Task<Result<IEnumerable                  │
│       <OfferDetailsDto>>>                    │
│ + GetAvailableAsync(cancellationToken):      │
│     Task<Result<IEnumerable                  │
│       <OfferDetailsDto>>>                    │
│ + CreateAsync(dto: CreateOfferDetailsDto,    │
│     cancellationToken):                      │
│     Task<Result<OfferDetailsDto>>            │
│ + UpdateAsync(id: Guid,                      │
│     dto: UpdateOfferDetailsDto,              │
│     cancellationToken):                      │
│     Task<Result<OfferDetailsDto>>            │
│ + SetAvailabilityAsync(id: Guid,             │
│     isAvailable: Boolean, cancellationToken):│
│     Task<Result>                             │
│ + DeleteAsync(id: Guid, cancellationToken):  │
│     Task<Result>                             │
└──────────────────────────────────────────────┘
```

### 4.3 Service Implementations

```
┌──────────────────────────────────────────────┐
│               ProductService                 │
│          <<Service / IProductService>>       │
├──────────────────────────────────────────────┤
│ - _unitOfWork: IUnitOfWork                   │
│ - _mapper: IMapper                           │
├──────────────────────────────────────────────┤
│ + ProductService(unitOfWork: IUnitOfWork,    │
│                  mapper: IMapper)            │
│ + GetByIdAsync(id, cancellationToken):       │
│     Task<Result<ProductDto>>                 │
│ + GetAllAsync(cancellationToken):            │
│     Task<Result<IEnumerable<ProductDto>>>    │
│ + GetActiveProductsAsync(cancellationToken): │
│     Task<Result<IEnumerable<ProductDto>>>    │
│ + GetByCategoryAsync(category,               │
│     cancellationToken):                      │
│     Task<Result<IEnumerable<ProductDto>>>    │
│ + CreateAsync(dto, cancellationToken):       │
│     Task<Result<ProductDto>>                 │
│ + UpdateAsync(id, dto, cancellationToken):   │
│     Task<Result<ProductDto>>                 │
│ + DeleteAsync(id, cancellationToken):        │
│     Task<Result>                             │
│ + ActivateAsync(id, cancellationToken):      │
│     Task<Result>                             │
│ + DeactivateAsync(id, cancellationToken):    │
│     Task<Result>                             │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│             TariffPlanService                │
│        <<Service / ITariffPlanService>>      │
├──────────────────────────────────────────────┤
│ - _unitOfWork: IUnitOfWork                   │
│ - _mapper: IMapper                           │
├──────────────────────────────────────────────┤
│ + TariffPlanService(unitOfWork: IUnitOfWork, │
│                     mapper: IMapper)         │
│ + GetByIdAsync(id, cancellationToken):       │
│     Task<Result<TariffPlanDto>>              │
│ + GetAllAsync(cancellationToken):            │
│     Task<Result<IEnumerable<TariffPlanDto>>> │
│ + GetActiveAsync(cancellationToken):         │
│     Task<Result<IEnumerable<TariffPlanDto>>> │
│ + CreateAsync(dto, cancellationToken):       │
│     Task<Result<TariffPlanDto>>              │
│ + UpdateAsync(id, dto, cancellationToken):   │
│     Task<Result<TariffPlanDto>>              │
│ + DeleteAsync(id, cancellationToken):        │
│     Task<Result>                             │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│            OfferDetailsService               │
│       <<Service / IOfferDetailsService>>     │
├──────────────────────────────────────────────┤
│ - _offerDetailsRepository:                   │
│     IOfferDetailsRepository                  │
│ - _productRepository: IProductRepository     │
│ - _unitOfWork: IUnitOfWork                   │
│ - _mapper: IMapper                           │
│ - _logger: ILogger<OfferDetailsService>      │
├──────────────────────────────────────────────┤
│ + OfferDetailsService(                       │
│     offerDetailsRepository,                  │
│     productRepository, unitOfWork,           │
│     mapper, logger)                          │
│ + GetByIdAsync(id, cancellationToken):       │
│     Task<Result<OfferDetailsDto>>            │
│ + GetByProductIdAsync(productId,             │
│     cancellationToken):                      │
│     Task<Result<OfferDetailsDto>>            │
│ + GetAllAsync(cancellationToken):            │
│     Task<Result<IEnumerable                  │
│       <OfferDetailsDto>>>                    │
│ + GetAvailableAsync(cancellationToken):      │
│     Task<Result<IEnumerable                  │
│       <OfferDetailsDto>>>                    │
│ + CreateAsync(dto, cancellationToken):       │
│     Task<Result<OfferDetailsDto>>            │
│ + UpdateAsync(id, dto, cancellationToken):   │
│     Task<Result<OfferDetailsDto>>            │
│ + SetAvailabilityAsync(id, isAvailable,      │
│     cancellationToken): Task<Result>         │
│ + DeleteAsync(id, cancellationToken):        │
│     Task<Result>                             │
└──────────────────────────────────────────────┘
```

### 4.4 Validators

```
┌──────────────────────────────────────────────┐
│           CreateProductValidator             │
│   <<Validator / AbstractValidator>>          │
├──────────────────────────────────────────────┤
│ + CreateProductValidator()                   │
├──────────────────────────────────────────────┤
│ Validation Rules:                            │
│ • Name: Required, MaxLength(200)             │
│ • Description: Required, MaxLength(1000)     │
│ • ProductCode: Required, MaxLength(50)       │
│ • Price: GreaterThanOrEqualTo(0)             │
│ • Category: IsInEnum                         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│           UpdateProductValidator             │
│   <<Validator / AbstractValidator>>          │
├──────────────────────────────────────────────┤
│ + UpdateProductValidator()                   │
├──────────────────────────────────────────────┤
│ Validation Rules:                            │
│ • Name: Required, MaxLength(200)             │
│ • Description: Required, MaxLength(1000)     │
│ • Price: GreaterThanOrEqualTo(0)             │
└──────────────────────────────────────────────┘
```

### 4.5 Mappings

```
┌──────────────────────────────────────────────┐
│              MappingProfile                  │
│            <<AutoMapper.Profile>>            │
├──────────────────────────────────────────────┤
│ + MappingProfile()                           │
├──────────────────────────────────────────────┤
│ Configured Mappings:                         │
│ • Product ↔ ProductDto                       │
│ • CreateProductDto → Product                 │
│ • UpdateProductDto → Product                 │
│ • TariffPlan ↔ TariffPlanDto                 │
│ • CreateTariffPlanDto → TariffPlan           │
│ • UpdateTariffPlanDto → TariffPlan           │
│ • OfferDetails ↔ OfferDetailsDto             │
│ • CreateOfferDetailsDto → OfferDetails       │
│ • UpdateOfferDetailsDto → OfferDetails       │
└──────────────────────────────────────────────┘
```

---

## 5. Infrastructure Layer

### 5.1 Data Context

```
┌──────────────────────────────────────────────┐
│             CatalogDbContext                 │
│              <<DbContext>>                   │
├──────────────────────────────────────────────┤
│ + Products: DbSet<Product>                   │
│ + TariffPlans: DbSet<TariffPlan>             │
│ + OfferDetails: DbSet<OfferDetails>          │
│ + ServiceTypes: DbSet<ServiceType>           │
├──────────────────────────────────────────────┤
│ + CatalogDbContext(options:                  │
│     DbContextOptions<CatalogDbContext>)      │
│ # OnModelCreating(modelBuilder:              │
│     ModelBuilder): void                      │
└──────────────────────────────────────────────┘
```

### 5.2 Repositories

```
┌──────────────────────────────────────────────┐
│             ProductRepository                │
│     <<Repository / IProductRepository>>      │
├──────────────────────────────────────────────┤
│ - _context: CatalogDbContext                 │
├──────────────────────────────────────────────┤
│ + ProductRepository(context:                 │
│     CatalogDbContext)                        │
│ + GetByIdAsync(id, cancellationToken):       │
│     Task<Product?>                           │
│ + GetByProductCodeAsync(productCode,         │
│     cancellationToken): Task<Product?>       │
│ + GetAllAsync(cancellationToken):            │
│     Task<IEnumerable<Product>>               │
│ + GetActiveProductsAsync(cancellationToken): │
│     Task<IEnumerable<Product>>               │
│ + GetByCategoryAsync(category,               │
│     cancellationToken):                      │
│     Task<IEnumerable<Product>>               │
│ + AddAsync(product, cancellationToken): Task │
│ + Update(product): void                      │
│ + Delete(product): void                      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│           TariffPlanRepository               │
│   <<Repository / ITariffPlanRepository>>     │
├──────────────────────────────────────────────┤
│ - _context: CatalogDbContext                 │
├──────────────────────────────────────────────┤
│ + TariffPlanRepository(context:              │
│     CatalogDbContext)                        │
│ + GetByIdAsync(id, cancellationToken):       │
│     Task<TariffPlan?>                        │
│ + GetAllAsync(cancellationToken):            │
│     Task<IEnumerable<TariffPlan>>            │
│ + GetActiveAsync(cancellationToken):         │
│     Task<IEnumerable<TariffPlan>>            │
│ + GetByProductIdAsync(productId,             │
│     cancellationToken):                      │
│     Task<IEnumerable<TariffPlan>>            │
│ + AddAsync(tariffPlan, cancellationToken):   │
│     Task                                     │
│ + Update(tariffPlan): void                   │
│ + Delete(tariffPlan): void                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│          OfferDetailsRepository              │
│  <<Repository / IOfferDetailsRepository>>    │
├──────────────────────────────────────────────┤
│ - _context: CatalogDbContext                 │
├──────────────────────────────────────────────┤
│ + OfferDetailsRepository(context:            │
│     CatalogDbContext)                        │
│ + GetByIdAsync(id, cancellationToken):       │
│     Task<OfferDetails?>                      │
│ + GetByProductIdAsync(productId,             │
│     cancellationToken): Task<OfferDetails?>  │
│ + GetAllAsync(cancellationToken):            │
│     Task<IEnumerable<OfferDetails>>          │
│ + GetAvailableAsync(cancellationToken):      │
│     Task<IEnumerable<OfferDetails>>          │
│ + AddAsync(offerDetails, cancellationToken): │
│     Task                                     │
│ + Update(offerDetails): void                 │
│ + Delete(offerDetails): void                 │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│                UnitOfWork                    │
│       <<UnitOfWork / IUnitOfWork>>           │
├──────────────────────────────────────────────┤
│ - _context: CatalogDbContext                 │
│ - _transaction: IDbContextTransaction?       │
│ - _productRepository: IProductRepository?    │
│ - _tariffPlanRepository:                     │
│     ITariffPlanRepository?                   │
├──────────────────────────────────────────────┤
│ + Products: IProductRepository {get}         │
│ + TariffPlans: ITariffPlanRepository {get}   │
├──────────────────────────────────────────────┤
│ + UnitOfWork(context: CatalogDbContext)      │
│ + SaveChangesAsync(cancellationToken):       │
│     Task<int>                                │
│ + BeginTransactionAsync(cancellationToken):  │
│     Task                                     │
│ + CommitTransactionAsync(cancellationToken): │
│     Task                                     │
│ + RollbackTransactionAsync(                  │
│     cancellationToken): Task                 │
│ + Dispose(): void                            │
└──────────────────────────────────────────────┘
```

### 5.3 Entity Configurations

```
┌──────────────────────────────────────────────┐
│           ProductConfiguration               │
│    <<IEntityTypeConfiguration<Product>>>     │
├──────────────────────────────────────────────┤
│ + Configure(builder:                         │
│     EntityTypeBuilder<Product>): void        │
├──────────────────────────────────────────────┤
│ Configuration:                               │
│ • Table: "Products"                          │
│ • PrimaryKey: Id                             │
│ • UniqueIndex: ProductCode                   │
│ • HasMany: TariffPlans (SetNull on delete)   │
│ • QueryFilter: !IsDeleted                    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│         TariffPlanConfiguration              │
│   <<IEntityTypeConfiguration<TariffPlan>>>   │
├──────────────────────────────────────────────┤
│ + Configure(builder:                         │
│     EntityTypeBuilder<TariffPlan>): void     │
├──────────────────────────────────────────────┤
│ Configuration:                               │
│ • Table: "TariffPlans"                       │
│ • PrimaryKey: Id                             │
│ • Defaults: IsUnlimitedData=false,           │
│             IsActive=true                    │
│ • QueryFilter: !IsDeleted                    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│        OfferDetailsConfiguration             │
│  <<IEntityTypeConfiguration<OfferDetails>>>  │
├──────────────────────────────────────────────┤
│ + Configure(builder:                         │
│     EntityTypeBuilder<OfferDetails>): void   │
├──────────────────────────────────────────────┤
│ Configuration:                               │
│ • Table: "OfferDetails"                      │
│ • PrimaryKey: Id                             │
│ • UniqueIndex: ProductId                     │
│ • Index: IsAvailable                         │
│ • HasOne: Product (Restrict on delete)       │
│ • QueryFilter: !IsDeleted                    │
└──────────────────────────────────────────────┘
```

---

## 6. API Layer

### 6.1 Controllers

```
┌──────────────────────────────────────────────┐
│            ProductsController                │
│     <<ApiController / ControllerBase>>       │
├──────────────────────────────────────────────┤
│ - _productService: IProductService           │
│ - _logger: ILogger<ProductsController>       │
├──────────────────────────────────────────────┤
│ + ProductsController(productService,         │
│     logger)                                  │
│ + GetAll(cancellationToken):                 │
│     [GET /api/products]                      │
│     ActionResult<IEnumerable<ProductDto>>    │
│ + GetActive(cancellationToken):              │
│     [GET /api/products/active]               │
│     ActionResult<IEnumerable<ProductDto>>    │
│ + GetById(id, cancellationToken):            │
│     [GET /api/products/{id}]                 │
│     ActionResult<ProductDto>                 │
│ + GetByCategory(category, cancellationToken):│
│     [GET /api/products/category/{category}]  │
│     ActionResult<IEnumerable<ProductDto>>    │
│ + Create(dto, cancellationToken):            │
│     [POST /api/products]                     │
│     ActionResult<ProductDto>                 │
│ + Update(id, dto, cancellationToken):        │
│     [PUT /api/products/{id}]                 │
│     ActionResult<ProductDto>                 │
│ + Delete(id, cancellationToken):             │
│     [DELETE /api/products/{id}]              │
│     ActionResult                             │
│ + Activate(id, cancellationToken):           │
│     [PATCH /api/products/{id}/activate]      │
│     ActionResult                             │
│ + Deactivate(id, cancellationToken):         │
│     [PATCH /api/products/{id}/deactivate]    │
│     ActionResult                             │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│          TariffPlansController               │
│     <<ApiController / ControllerBase>>       │
├──────────────────────────────────────────────┤
│ - _tariffPlanService: ITariffPlanService     │
│ - _logger: ILogger<TariffPlansController>    │
├──────────────────────────────────────────────┤
│ + TariffPlansController(tariffPlanService,   │
│     logger)                                  │
│ + GetAll(cancellationToken):                 │
│     [GET /api/tariffplans]                   │
│     ActionResult<IEnumerable<TariffPlanDto>> │
│ + GetActive(cancellationToken):              │
│     [GET /api/tariffplans/active]            │
│     ActionResult<IEnumerable<TariffPlanDto>> │
│ + GetById(id, cancellationToken):            │
│     [GET /api/tariffplans/{id}]              │
│     ActionResult<TariffPlanDto>              │
│ + Create(dto, cancellationToken):            │
│     [POST /api/tariffplans]                  │
│     ActionResult<TariffPlanDto>              │
│ + Update(id, dto, cancellationToken):        │
│     [PUT /api/tariffplans/{id}]              │
│     ActionResult<TariffPlanDto>              │
│ + Delete(id, cancellationToken):             │
│     [DELETE /api/tariffplans/{id}]           │
│     ActionResult                             │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│         OfferDetailsController               │
│     <<ApiController / ControllerBase>>       │
├──────────────────────────────────────────────┤
│ - _offerDetailsService: IOfferDetailsService │
│ - _logger: ILogger<OfferDetailsController>   │
├──────────────────────────────────────────────┤
│ + OfferDetailsController(offerDetailsService,│
│     logger)                                  │
│ + GetAll(cancellationToken):                 │
│     [GET /api/offerdetails]                  │
│     ActionResult<IEnumerable                 │
│       <OfferDetailsDto>>                     │
│ + GetAvailable(cancellationToken):           │
│     [GET /api/offerdetails/available]        │
│     ActionResult<IEnumerable                 │
│       <OfferDetailsDto>>                     │
│ + GetById(id, cancellationToken):            │
│     [GET /api/offerdetails/{id}]             │
│     ActionResult<OfferDetailsDto>            │
│ + GetByProductId(productId,                  │
│     cancellationToken):                      │
│     [GET /api/offerdetails/product/          │
│       {productId}]                           │
│     ActionResult<OfferDetailsDto>            │
│ + Create(dto, cancellationToken):            │
│     [POST /api/offerdetails]                 │
│     ActionResult<OfferDetailsDto>            │
│ + Update(id, dto, cancellationToken):        │
│     [PUT /api/offerdetails/{id}]             │
│     ActionResult<OfferDetailsDto>            │
│ + SetAvailability(id, isAvailable,           │
│     cancellationToken):                      │
│     [PATCH /api/offerdetails/{id}/           │
│       availability]                          │
│     ActionResult                             │
│ + Delete(id, cancellationToken):             │
│     [DELETE /api/offerdetails/{id}]          │
│     ActionResult                             │
└──────────────────────────────────────────────┘
```

### 6.2 Middleware

```
┌──────────────────────────────────────────────┐
│       ExceptionHandlingMiddleware            │
│              <<Middleware>>                  │
├──────────────────────────────────────────────┤
│ - _next: RequestDelegate                     │
│ - _logger: ILogger                           │
│     <ExceptionHandlingMiddleware>            │
├──────────────────────────────────────────────┤
│ + ExceptionHandlingMiddleware(next, logger)  │
│ + InvokeAsync(context: HttpContext): Task    │
│ - HandleExceptionAsync(context, exception):  │
│     Task                                     │
├──────────────────────────────────────────────┤
│ Exception Mapping:                           │
│ • NotFoundException → 404 NOT_FOUND          │
│ • ValidationException → 400 VALIDATION_ERROR │
│ • BusinessRuleException →                    │
│     400 BUSINESS_RULE_VIOLATION              │
│ • Default → 500 INTERNAL_SERVER_ERROR        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│              ErrorResponse                   │
│                <<DTO>>                       │
├──────────────────────────────────────────────┤
│ + Code: String                               │
│ + Message: String                            │
│ + Errors: Dictionary<String, String[]>?      │
└──────────────────────────────────────────────┘
```

---

## 7. External Dependencies

### 7.1 SharedKernel (BuildingBlocks)

```
┌──────────────────────────────────────────────┐
│                BaseEntity                    │
│            <<Abstract Class>>                │
├──────────────────────────────────────────────┤
│ # id: Guid                                   │
│ # createdAt: DateTime                        │
│ # updatedAt: DateTime?                       │
│ # isDeleted: Boolean                         │
├──────────────────────────────────────────────┤
│ # BaseEntity()                               │
│ # BaseEntity(id: Guid)                       │
│ + MarkAsUpdated(): void                      │
│ + MarkAsDeleted(): void                      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│             IAggregateRoot                   │
│         <<Marker Interface>>                 │
├──────────────────────────────────────────────┤
│ (empty - used for DDD identification)        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│                  Result                      │
│            <<Result Pattern>>                │
├──────────────────────────────────────────────┤
│ + IsSuccess: Boolean                         │
│ + IsFailure: Boolean                         │
│ + Error: String                              │
├──────────────────────────────────────────────┤
│ # Result(isSuccess, error)                   │
│ + Success(): Result                          │
│ + Failure(error: String): Result             │
│ + Success<T>(value: T): Result<T>            │
│ + Failure<T>(error: String): Result<T>       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│                Result<T>                     │
│         <<Generic Result / Result>>          │
├──────────────────────────────────────────────┤
│ + Value: T?                                  │
├──────────────────────────────────────────────┤
│ # Result(value, isSuccess, error)            │
└──────────────────────────────────────────────┘
```

### 7.2 Common (BuildingBlocks)

```
┌──────────────────────────────────────────────┐
│              BaseException                   │
│       <<Abstract Class / Exception>>         │
├──────────────────────────────────────────────┤
│ + Code: String                               │
├──────────────────────────────────────────────┤
│ # BaseException(code, message)               │
│ # BaseException(code, message,               │
│     innerException)                          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│            NotFoundException                 │
│       <<Exception / BaseException>>          │
├──────────────────────────────────────────────┤
│ (inherited) Code: String = "NOT_FOUND"       │
├──────────────────────────────────────────────┤
│ + NotFoundException(entityName: String,      │
│     id: Object)                              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│           ValidationException                │
│       <<Exception / BaseException>>          │
├──────────────────────────────────────────────┤
│ + Errors: Dictionary<String, String[]>       │
├──────────────────────────────────────────────┤
│ + ValidationException(errors:                │
│     Dictionary<String, String[]>)            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│         BusinessRuleException                │
│       <<Exception / BaseException>>          │
├──────────────────────────────────────────────┤
│ (inherited) Code: String =                   │
│     "BUSINESS_RULE_VIOLATION"                │
├──────────────────────────────────────────────┤
│ + BusinessRuleException(message: String)     │
└──────────────────────────────────────────────┘
```

---

## 8. Class Relationships

### 8.1 Inheritance Hierarchy

```
                    ┌─────────────┐
                    │ BaseEntity  │
                    │ <<abstract>>│
                    └──────┬──────┘
                           │ extends
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌──────▼─────┐   ┌──────▼──────┐
    │  Product  │   │ TariffPlan │   │OfferDetails │
    │<<Aggregate│   │<<Aggregate>│   │<<Aggregate>>│
    └───────────┘   └────────────┘   └─────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ implements
                    ┌──────▼──────┐
                    │IAggregateRoot│
                    │<<interface>>│
                    └─────────────┘
```

### 8.2 Entity Relationships

```
    ┌──────────────────────────────────────────┐
    │                                          │
    │   ┌──────────┐     1    ┌────────────┐   │
    │   │ Product  │◆────────*│ TariffPlan │   │
    │   └────┬─────┘          └────────────┘   │
    │        │ 1                               │
    │        │                                 │
    │        │ 1                               │
    │   ┌────▼──────────┐                      │
    │   │ OfferDetails  │                      │
    │   └───────────────┘                      │
    │                                          │
    └──────────────────────────────────────────┘

    Legend:
    ◆──── Composition (one-to-many)
    ───── Association (one-to-one)
```

### 8.3 Layer Dependencies

```
    ┌───────────────────────────────────────────┐
    │              Catalog.API                  │
    │         (Presentation Layer)              │
    └────────────────────┬──────────────────────┘
                         │ depends on
    ┌────────────────────▼──────────────────────┐
    │          Catalog.Application              │
    │           (Application Layer)             │
    └────────────────────┬──────────────────────┘
                         │ depends on
    ┌────────────────────▼──────────────────────┐
    │            Catalog.Domain                 │
    │            (Domain Layer)                 │
    └────────────────────▲──────────────────────┘
                         │ implements
    ┌────────────────────┴──────────────────────┐
    │        Catalog.Infrastructure             │
    │         (Infrastructure Layer)            │
    └───────────────────────────────────────────┘
```

---

## Document Summary

This Detailed Design Document covers:

- **4 architectural layers** (API, Application, Domain, Infrastructure)
- **3 domain entities** with aggregate roots (Product, TariffPlan, OfferDetails)
- **4 repository interfaces** + 4 implementations
- **3 application services** with Result pattern
- **3 API controllers** with RESTful endpoints
- **Complete UML-style class diagrams** for all classes
