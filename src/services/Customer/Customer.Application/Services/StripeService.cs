using Stripe;
using Stripe.Checkout;

namespace Customer.Application.Services;

public interface IStripeService
{
    Task<Session> CreateCheckoutSessionAsync(
        string customerEmail,
        string productName,
        decimal price,
        string successUrl,
        string cancelUrl,
        Dictionary<string, string>? metadata = null);
    
    Event ConstructEvent(string json, string signature, string webhookSecret);
}

public class StripeService : IStripeService
{
    private readonly string _apiKey;

    public StripeService(string apiKey)
    {
        _apiKey = apiKey;
        StripeConfiguration.ApiKey = apiKey;
    }

    public async Task<Session> CreateCheckoutSessionAsync(
        string customerEmail,
        string productName,
        decimal price,
        string successUrl,
        string cancelUrl,
        Dictionary<string, string>? metadata = null)
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            Mode = "subscription",
            CustomerEmail = customerEmail,
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "eur",
                        UnitAmount = (long)(price * 100), // Convert to cents
                        Recurring = new SessionLineItemPriceDataRecurringOptions
                        {
                            Interval = "month"
                        },
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = productName,
                        }
                    },
                    Quantity = 1
                }
            },
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            Metadata = metadata
        };

        var service = new SessionService();
        return await service.CreateAsync(options);
    }

    public Event ConstructEvent(string json, string signature, string webhookSecret)
    {
        return EventUtility.ConstructEvent(json, signature, webhookSecret);
    }
}
