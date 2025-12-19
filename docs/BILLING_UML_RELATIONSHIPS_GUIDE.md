# Billing Service UML Relationships Guide

This document explains all the UML relationship types used in the Billing Service class diagram and how to interpret them.

## UML Relationship Types

### 1. **Composition** (Filled Diamond ◆)
**Notation:** Solid line with a filled black diamond on the container side

**Meaning:** A strong "whole-part" relationship where:
- The part cannot exist without the whole
- When the whole is destroyed, all parts are destroyed
- The whole has exclusive ownership of the parts

**Examples in Billing Service:**
```
Invoice ◆──→ InvoiceItem (1..*)
```
- An Invoice **contains** InvoiceItems
- InvoiceItems cannot exist without their parent Invoice
- When an Invoice is deleted, all its InvoiceItems are also deleted
- Multiplicity: 1 Invoice can have many (1..*) InvoiceItems

```
Invoice ◆──→ Payment (0..*)
```
- An Invoice **contains** Payments
- Payments are tied to a specific Invoice
- When an Invoice is deleted, its Payment records are deleted
- Multiplicity: 1 Invoice can have zero or many (0..*) Payments

**How to Create in Draw.io:**
1. Select the line tool
2. Choose "Composition" from the connector options
3. Draw from the part (InvoiceItem) to the whole (Invoice)
4. The filled diamond appears on the Invoice side
5. Add multiplicity labels (e.g., "1..*", "0..*")

---

### 2. **Aggregation** (Hollow Diamond ◇)
**Notation:** Solid line with a hollow/white diamond on the container side

**Meaning:** A weak "whole-part" relationship where:
- The part can exist independently of the whole
- When the whole is destroyed, parts can continue to exist
- Shared ownership is possible

**Examples in Billing Service:**
```
IUnitOfWork ◇──→ IInvoiceRepository
IUnitOfWork ◇──→ IPaymentRepository
```
- IUnitOfWork **aggregates** repository interfaces
- The repositories can exist independently
- IUnitOfWork provides access to repositories but doesn't own them exclusively
- Repositories can be used outside of UnitOfWork context

**How to Create in Draw.io:**
1. Select the line tool
2. Choose "Aggregation" from the connector options
3. Draw from the part (IInvoiceRepository) to the container (IUnitOfWork)
4. The hollow diamond appears on the IUnitOfWork side
5. Label the relationship if needed

---

### 3. **Dependency** (Dashed Arrow --→)
**Notation:** Dashed line with an open arrowhead

**Meaning:** One class uses or depends on another class:
- The dependent class needs the other class to function
- Usually represents method parameters, local variables, or return types
- The weakest relationship type
- Changes to the used class may affect the dependent class

**Examples in Billing Service:**

**Controllers depend on Service Interfaces:**
```
InvoicesController ----→ IInvoiceService
PaymentsController ----→ IPaymentService
BalanceController ----→ IBalanceService
```
- Controllers use service interfaces via dependency injection
- Controllers call methods on the services
- Labeled as `«uses»`

**Services depend on IUnitOfWork:**
```
InvoiceService ----→ IUnitOfWork
PaymentService ----→ IUnitOfWork
BalanceService ----→ IUnitOfWork
```
- Services use IUnitOfWork to access repositories
- IUnitOfWork is injected via constructor
- Labeled as `«uses»`

**Repositories depend on BillingDbContext:**
```
InvoiceRepository ----→ BillingDbContext
PaymentRepository ----→ BillingDbContext
UnitOfWork ----→ BillingDbContext
```
- Repositories use DbContext to perform database operations
- DbContext is injected via constructor

**Entities use Enumerations:**
```
Invoice ----→ InvoiceStatus
Payment ----→ PaymentMethod
Payment ----→ PaymentStatus
```
- Entities have properties of enum types
- Labeled as `«uses»`

**How to Create in Draw.io:**
1. Select the line tool
2. Choose "Dependency" or manually set: dashed line, open arrow
3. Set line style to "Dashed" (dashPattern=1 2)
4. Set arrow to "Open" (endArrow=open)
5. Draw from the dependent class to the used class
6. Add stereotype label `«uses»` or `«depends»`

---

### 4. **Implementation/Realization** (Dashed Triangle Arrow)
**Notation:** Dashed line with a closed hollow triangle arrowhead

**Meaning:** A class implements an interface or realizes an abstract class:
- The implementing class provides concrete behavior for the interface
- All interface methods must be implemented
- Represents the "implements" keyword in C#

**Examples in Billing Service:**

**Repository Implementations:**
```
InvoiceRepository ----▷ IInvoiceRepository
PaymentRepository ----▷ IPaymentRepository
UnitOfWork ----▷ IUnitOfWork
```
- Concrete classes implement the interface contracts
- Arrow points from implementation to interface

**Service Implementations:**
```
InvoiceService ----▷ IInvoiceService
PaymentService ----▷ IPaymentService
BalanceService ----▷ IBalanceService
```
- Service classes implement their respective interfaces
- Provides dependency inversion principle (DIP)

**How to Create in Draw.io:**
1. Select the line tool
2. Choose "Realization" or "Implementation"
3. Set line style to "Dashed"
4. Set arrow to "Block" with endFill=0 (hollow triangle)
5. Draw from the implementing class to the interface
6. The hollow triangle appears on the interface side

---

### 5. **Inheritance/Generalization** (Solid Triangle Arrow)
**Notation:** Solid line with a closed hollow triangle arrowhead

**Meaning:** A class inherits from another class (subclass → superclass):
- The child class inherits all properties and methods from parent
- Represents the "extends" or ":" keyword in C#
- "Is-a" relationship

**Examples in Billing Service:**
```
Invoice ───▷ BaseEntity
InvoiceItem ───▷ BaseEntity
Payment ───▷ BaseEntity
```
- Domain entities inherit from BaseEntity
- They get Id, CreatedAt, UpdatedAt, IsDeleted properties
- They inherit MarkAsUpdated() and MarkAsDeleted() methods

```
Invoice ───▷ IAggregateRoot
Payment ───▷ IAggregateRoot
```
- Invoice and Payment implement the aggregate root marker interface
- Indicates they are entry points for their aggregates

**How to Create in Draw.io:**
1. Select the line tool
2. Choose "Generalization" or "Inheritance"
3. Set line style to "Solid"
4. Set arrow to "Block" with endFill=0 (hollow triangle)
5. Draw from the child class to the parent class/interface
6. The hollow triangle appears on the parent side

---

## Complete Relationship Matrix for Billing Service

### Domain Layer Relationships

| Source Class | Relationship Type | Target Class | Multiplicity | Description |
|--------------|-------------------|--------------|--------------|-------------|
| Invoice | Inheritance | BaseEntity | - | Inherits base properties |
| Invoice | Implementation | IAggregateRoot | - | Marks as aggregate root |
| Invoice | Composition | InvoiceItem | 1..* | Contains invoice items |
| Invoice | Composition | Payment | 0..* | Contains payments |
| Invoice | Dependency | InvoiceStatus | - | Uses enum for status |
| InvoiceItem | Inheritance | BaseEntity | - | Inherits base properties |
| Payment | Inheritance | BaseEntity | - | Inherits base properties |
| Payment | Implementation | IAggregateRoot | - | Marks as aggregate root |
| Payment | Dependency | PaymentMethod | - | Uses enum for method |
| Payment | Dependency | PaymentStatus | - | Uses enum for status |

### Repository Layer Relationships

| Source Class | Relationship Type | Target Class | Description |
|--------------|-------------------|--------------|-------------|
| InvoiceRepository | Implementation | IInvoiceRepository | Implements interface |
| InvoiceRepository | Dependency | BillingDbContext | Uses DbContext |
| PaymentRepository | Implementation | IPaymentRepository | Implements interface |
| PaymentRepository | Dependency | BillingDbContext | Uses DbContext |
| UnitOfWork | Implementation | IUnitOfWork | Implements interface |
| UnitOfWork | Dependency | BillingDbContext | Uses DbContext |
| UnitOfWork | Dependency | InvoiceRepository | Creates repository |
| UnitOfWork | Dependency | PaymentRepository | Creates repository |
| IUnitOfWork | Aggregation | IInvoiceRepository | Provides access |
| IUnitOfWork | Aggregation | IPaymentRepository | Provides access |

### Application Layer Relationships

| Source Class | Relationship Type | Target Class | Description |
|--------------|-------------------|--------------|-------------|
| InvoiceService | Implementation | IInvoiceService | Implements interface |
| InvoiceService | Dependency | IUnitOfWork | Uses for data access |
| InvoiceService | Dependency | IMapper | Uses for mapping |
| PaymentService | Implementation | IPaymentService | Implements interface |
| PaymentService | Dependency | IUnitOfWork | Uses for data access |
| PaymentService | Dependency | IMapper | Uses for mapping |
| BalanceService | Implementation | IBalanceService | Implements interface |
| BalanceService | Dependency | IUnitOfWork | Uses for data access |

### API Layer Relationships

| Source Class | Relationship Type | Target Class | Description |
|--------------|-------------------|--------------|-------------|
| InvoicesController | Dependency | IInvoiceService | Uses service |
| InvoicesController | Dependency | ILogger | Uses for logging |
| PaymentsController | Dependency | IPaymentService | Uses service |
| BalanceController | Dependency | IBalanceService | Uses service |

---

## Quick Reference: Relationship Symbols

| Symbol | Name | Line Type | Arrow Type | Meaning |
|--------|------|-----------|------------|---------|
| ◆──→ | Composition | Solid | Filled Diamond | Strong ownership, part dies with whole |
| ◇──→ | Aggregation | Solid | Hollow Diamond | Weak ownership, part can exist independently |
| ----→ | Dependency | Dashed | Open Arrow | Uses, depends on |
| ----▷ | Implementation | Dashed | Hollow Triangle | Implements interface |
| ───▷ | Inheritance | Solid | Hollow Triangle | Inherits from, extends |
| ───→ | Association | Solid | Open Arrow | General relationship |

---

## Tips for Creating UML Diagrams in Draw.io

### 1. **Organize by Layers**
- Group domain entities together
- Keep interfaces near their implementations
- Separate API, Application, Domain, and Infrastructure layers visually

### 2. **Use Consistent Styling**
- Entities: White background, black border
- Interfaces: Gray/italic text with `«interface»` stereotype
- Enums: Light color with `«enumeration»` stereotype
- Controllers: Different color to distinguish API layer

### 3. **Label Relationships**
- Add multiplicity (1, 0..1, 1..*, 0..*)
- Add role names when helpful
- Add stereotypes («uses», «creates», etc.)

### 4. **Avoid Crossing Lines**
- Arrange classes to minimize line crossings
- Use orthogonal routing for cleaner diagrams
- Group related classes together

### 5. **Show Key Information**
- Include all public properties and methods
- Use visibility markers (+ public, - private, # protected)
- Show method parameters and return types (abbreviated if needed)

---

## How to Read the Billing Service Diagram

1. **Start with Domain Entities** (Invoice, Payment, InvoiceItem)
   - These are the core business objects
   - Notice composition relationships showing ownership

2. **Follow to Repositories** 
   - See how interfaces define contracts
   - Implementation classes use DbContext

3. **Move to Services**
   - Services implement business logic
   - They depend on UnitOfWork for data access
   - They use AutoMapper for DTO conversion

4. **End at Controllers**
   - Controllers are entry points for HTTP requests
   - They depend on service interfaces
   - Follow dependency inversion principle

5. **Notice Dependencies Flow Inward**
   - API → Application → Domain
   - Infrastructure implements Domain interfaces
   - Clean Architecture/Onion Architecture pattern

---

## Common Mistakes to Avoid

❌ **Using Composition when it should be Aggregation**
- If the part can exist without the whole, use aggregation
- Example: UnitOfWork and Repositories (aggregation, not composition)

❌ **Confusing Dependency and Association**
- Use dependency for temporary relationships (method parameters, local variables)
- Use association for persistent relationships (fields, properties)

❌ **Wrong Arrow Direction**
- Implementation: Arrow points FROM concrete TO interface
- Inheritance: Arrow points FROM child TO parent
- Dependency: Arrow points FROM dependent TO used class
- Composition: Diamond on the CONTAINER side

❌ **Missing Multiplicity**
- Always show multiplicity for compositions and aggregations
- Examples: 1, 0..1, 1..*, 0..*

---

## Additional Resources

- **UML Specification:** https://www.omg.org/spec/UML/
- **Draw.io Documentation:** https://www.drawio.com/doc/
- **Clean Architecture:** https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **Domain-Driven Design:** https://martinfowler.com/bliki/DomainDrivenDesign.html
