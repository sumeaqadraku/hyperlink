using Customer.Application.DTOs;
using Customer.Domain.Entities;
using Customer.Domain.Interfaces;
using System.Net.Http.Json;

namespace Customer.Application.Services;

public class SubscriptionService
{
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IStripeService _stripeService;

    public SubscriptionService(
        ISubscriptionRepository subscriptionRepository,
        ICustomerRepository customerRepository,
        IStripeService stripeService)
    {
        _subscriptionRepository = subscriptionRepository;
        _customerRepository = customerRepository;
        _stripeService = stripeService;
    }

    public async Task<IEnumerable<SubscriptionDto>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        var subs = await _subscriptionRepository.GetByCustomerIdAsync(customerId, cancellationToken);
        return subs.Select(Map);
    }

    public async Task<CreateSubscriptionResponse?> CreateAsync(CreateSubscriptionRequest request, CancellationToken cancellationToken = default)
    {
        // Get customer details
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer == null) return null;

        // Create subscription record with PENDING status
        var subscription = new Subscription(request.CustomerId, request.ProductId, request.ProductName, request.Price);
        await _subscriptionRepository.AddAsync(subscription, cancellationToken);

        // Create Stripe Checkout Session
        var metadata = new Dictionary<string, string>
        {
            { "subscription_id", subscription.Id.ToString() },
            { "customer_id", request.CustomerId.ToString() },
            { "product_id", request.ProductId.ToString() }
        };

        var session = await _stripeService.CreateCheckoutSessionAsync(
            customer.Email,
            request.ProductName ?? "Subscription",
            request.Price,
            request.SuccessUrl,
            request.CancelUrl,
            metadata
        );

        // Store Stripe session ID
        subscription.SetStripeSession(session.Id);
        await _subscriptionRepository.UpdateAsync(subscription, cancellationToken);

        return new CreateSubscriptionResponse
        {
            SubscriptionId = subscription.Id,
            CheckoutUrl = session.Url
        };
    }

    public async Task<bool> UpdateStatusAsync(Guid id, UpdateSubscriptionStatusRequest request, CancellationToken cancellationToken = default)
    {
        var sub = await _subscriptionRepository.GetByIdAsync(id, cancellationToken);
        if (sub == null) return false;
        if (!Enum.TryParse<SubscriptionStatus>(request.Status, true, out var newStatus)) return false;

        switch (newStatus)
        {
            case SubscriptionStatus.Active:
                sub.Activate();
                break;
            case SubscriptionStatus.Suspended:
                sub.Suspend();
                break;
            case SubscriptionStatus.Cancelled:
                sub.Cancel();
                break;
            case SubscriptionStatus.Expired:
                sub.Cancel();
                break;
        }

        await _subscriptionRepository.UpdateAsync(sub, cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sub = await _subscriptionRepository.GetByIdAsync(id, cancellationToken);
        if (sub == null) return false;
        _subscriptionRepository.Delete(sub);
        return true;
    }

    public async Task<bool> ConfirmSubscriptionAsync(Guid subscriptionId, string sessionId, CancellationToken cancellationToken = default)
    {
        var subscription = await _subscriptionRepository.GetByIdAsync(subscriptionId, cancellationToken);
        if (subscription == null) return false;

        return await ConfirmSubscriptionInternalAsync(subscription, sessionId, cancellationToken);
    }

    public async Task<bool> ConfirmSubscriptionBySessionAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        var subscription = await _subscriptionRepository.GetByStripeSessionIdAsync(sessionId, cancellationToken);
        if (subscription == null) return false;

        return await ConfirmSubscriptionInternalAsync(subscription, sessionId, cancellationToken);
    }

    private async Task<bool> ConfirmSubscriptionInternalAsync(Subscription subscription, string sessionId, CancellationToken cancellationToken)
    {
        try
        {
            // Retrieve session from Stripe to get customer and subscription IDs
            var sessionService = new Stripe.Checkout.SessionService();
            var session = await sessionService.GetAsync(sessionId, cancellationToken: cancellationToken);

            if (session.CustomerId != null && session.SubscriptionId != null)
            {
                subscription.SetStripeCustomer(session.CustomerId);
                subscription.SetStripeSubscription(session.SubscriptionId);
            }

            subscription.Activate();
            await _subscriptionRepository.UpdateAsync(subscription, cancellationToken);

            // Call Billing API to create invoice (will be done via HTTP client)
            await CreateInvoiceForSubscriptionAsync(subscription, session, cancellationToken);

            return true;
        }
        catch
        {
            return false;
        }
    }

    private async Task CreateInvoiceForSubscriptionAsync(Subscription subscription, Stripe.Checkout.Session session, CancellationToken cancellationToken)
    {
        try
        {
            using var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("http://billing-api");

            var invoiceDto = new
            {
                customerId = subscription.CustomerId,
                subscriptionId = subscription.Id,
                productName = subscription.ProductName,
                price = subscription.Price,
                stripeInvoiceId = session.InvoiceId,
                stripeCustomerId = session.CustomerId,
                periodStart = DateTime.UtcNow,
                periodEnd = DateTime.UtcNow.AddMonths(1)
            };

            await httpClient.PostAsJsonAsync("/api/invoices/from-subscription", invoiceDto, cancellationToken);
        }
        catch
        {
            // Log error but don't fail subscription confirmation
        }
    }

    public async Task<IEnumerable<SubscriptionDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var subs = await _subscriptionRepository.GetAllAsync(cancellationToken);
        return subs.Select(Map);
    }

    private static SubscriptionDto Map(Subscription s) => new SubscriptionDto
    {
        Id = s.Id,
        CustomerId = s.CustomerId,
        ProductId = s.ProductId,
        ProductName = s.ProductName,
        Price = s.Price,
        SubscriptionNumber = s.SubscriptionNumber,
        StartDate = s.StartDate,
        EndDate = s.EndDate,
        Status = s.Status.ToString(),
        AutoRenew = s.AutoRenew,
        CreatedAt = s.CreatedAt
    };
}
