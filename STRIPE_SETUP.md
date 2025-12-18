# Stripe Subscription Integration - Setup & Testing Guide

## 🎯 Overview

This guide covers the complete Stripe subscription integration (test mode) for the telecom application. The integration allows customers to subscribe to service offers using Stripe Checkout, with webhook support for automatic subscription activation.

---

## 📋 Prerequisites

1. **Stripe Account** (Test Mode)
   - Sign up at https://stripe.com
   - Get your test API keys from the Dashboard

2. **Running Services**
   - Customer API (port 3318)
   - Catalog API
   - Gateway API (port 5006)
   - Frontend (port 3000)

---

## ⚙️ Backend Configuration

### 1. Update Stripe API Keys

Edit `src/services/Customer/Customer.API/appsettings.json`:

```json
{
  "Stripe": {
    "SecretKey": "sk_test_YOUR_ACTUAL_SECRET_KEY",
    "PublishableKey": "pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY",
    "WebhookSecret": "whsec_YOUR_WEBHOOK_SECRET"
  }
}
```

**To get your keys:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Copy your **Publishable key** (starts with `pk_test_`)

### 2. Rebuild Customer API

```bash
cd src
docker-compose build customer-api
docker-compose up -d customer-api
```

### 3. Verify Customer API is Running

```bash
docker logs customer-api --tail 20
```

You should see: "Application started. Press Ctrl+C to shut down."

---

## 🌐 Frontend Configuration

### 1. Ensure Gateway URL is Set

Check `src/web/.env`:

```
VITE_API_URL=http://localhost:5006
```

### 2. Restart Frontend Dev Server

```bash
cd src/web
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🔗 Webhook Setup (Required for Activation)

Webhooks are required to activate subscriptions after payment. You have two options:

### Option A: Use Stripe CLI (Recommended for Testing)

1. **Install Stripe CLI**
   - Download from: https://stripe.com/docs/stripe-cli
   - Or use: `brew install stripe/stripe-cli/stripe` (Mac)

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward Webhooks to Local Server**
   ```bash
   stripe listen --forward-to http://localhost:5006/api/customer/webhooks/stripe
   ```

4. **Copy the Webhook Secret**
   - The CLI will display: `whsec_...`
   - Update `appsettings.json` with this secret
   - Restart customer-api

### Option B: Use ngrok (For External Testing)

1. **Install ngrok**
   - Download from: https://ngrok.com

2. **Expose Gateway**
   ```bash
   ngrok http 5006
   ```

3. **Configure Webhook in Stripe Dashboard**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - URL: `https://YOUR_NGROK_URL/api/customer/webhooks/stripe`
   - Events: Select `checkout.session.completed`
   - Copy the webhook secret to `appsettings.json`

---

## 🧪 Testing the Complete Flow

### Step 1: Create Test Data

1. **Log in as Admin**
   - Go to: http://localhost:3000/login
   - Email: `test@gmail.com` (or your admin email)
   - Password: Your password

2. **Create a Service Type (Offer)**
   - Go to: http://localhost:3000/dashboard/service-types
   - Click "Add Service Type"
   - Name: "Premium Internet"
   - Description: "High-speed fiber internet"
   - Base Price: 49.99
   - Click "Save"

3. **Create a Customer Profile**
   - Go to: http://localhost:3000/dashboard/customers
   - Click "Create Customer"
   - Select a user
   - Fill in details
   - Click "Save"

### Step 2: Test Subscription Flow

1. **Browse Offers**
   - Go to: http://localhost:3000/offers
   - You should see the "Premium Internet" offer

2. **View Offer Details**
   - Click "View Details" on the offer
   - You should see:
     - Offer name and description
     - Price (€49.99/month)
     - "Subscribe Now" button

3. **Subscribe**
   - Click "Subscribe Now"
   - You'll be redirected to Stripe Checkout

4. **Complete Payment (Test Mode)**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - Name: Any name
   - Click "Subscribe"

5. **Success Page**
   - After payment, you'll be redirected to: http://localhost:3000/subscription-success
   - The webhook will activate your subscription automatically

### Step 3: Verify in Admin Dashboard

1. **View Subscriptions**
   - Go to: http://localhost:3000/dashboard/subscriptions
   - You should see your new subscription with:
     - Status: **ACTIVE** (after webhook processing)
     - Customer email
     - Product name
     - Price
     - Stripe Customer ID
     - Stripe Subscription ID

2. **Check Webhook Logs**
   - In Stripe CLI terminal, you should see:
     ```
     checkout.session.completed [evt_...]
     ```
   - In customer-api logs:
     ```bash
     docker logs customer-api --tail 50
     ```
     You should see: "Successfully processed checkout for session..."

---

## 🧾 Stripe Test Cards

Use these test cards for different scenarios:

| Card Number          | Scenario                    |
|---------------------|-----------------------------|
| 4242 4242 4242 4242 | Success                     |
| 4000 0025 0000 3155 | Requires authentication     |
| 4000 0000 0000 9995 | Declined (insufficient funds)|
| 4000 0000 0000 0002 | Declined (generic)          |

**For all cards:**
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## 📊 Admin View Features

The admin subscription dashboard shows:

- ✅ Subscription Number
- ✅ Customer Email
- ✅ Product Name
- ✅ Monthly Price
- ✅ Status (Pending/Active/Cancelled)
- ✅ Start Date
- ✅ Stripe Customer ID
- ✅ Stripe Subscription ID
- ✅ Search functionality

---

## 🔍 Troubleshooting

### Issue: 405 Method Not Allowed on Subscribe

**Solution:**
- Ensure customer-api is rebuilt with latest code
- Check you're logged in
- Verify you have a customer profile

### Issue: Subscription stays PENDING

**Solution:**
- Check webhook is configured correctly
- Verify Stripe CLI is running: `stripe listen --forward-to...`
- Check webhook secret matches in appsettings.json
- Look at customer-api logs for webhook errors

### Issue: Can't see offers

**Solution:**
- Create service types in dashboard
- Ensure they're marked as "Active"
- Check catalog-api is running

### Issue: Redirect to Stripe fails

**Solution:**
- Check browser console for errors
- Verify Stripe secret key is correct
- Check customer-api logs for errors

---

## 🎬 Complete Test Checklist

- [ ] Stripe API keys configured
- [ ] Customer-api rebuilt and running
- [ ] Webhook configured (Stripe CLI or ngrok)
- [ ] Frontend dev server restarted
- [ ] Logged in as admin
- [ ] Service type created
- [ ] Customer profile exists
- [ ] Can browse offers at /offers
- [ ] Can view offer details
- [ ] Subscribe button works
- [ ] Redirects to Stripe Checkout
- [ ] Test card payment succeeds
- [ ] Redirects to success page
- [ ] Webhook processes successfully
- [ ] Subscription shows as ACTIVE in admin dashboard
- [ ] Stripe Customer ID and Subscription ID visible

---

## 📝 Important Notes

### Security
- ⚠️ **Never commit real API keys to git**
- ⚠️ **Use test mode keys only for development**
- ⚠️ **Webhook secret must match between Stripe and appsettings.json**

### Data Flow
1. Customer clicks "Subscribe" → Frontend calls `/api/customer/subscriptions`
2. Backend creates subscription (status: PENDING) → Creates Stripe Checkout Session
3. Customer completes payment on Stripe
4. Stripe sends webhook to `/api/customer/webhooks/stripe`
5. Backend updates subscription (status: ACTIVE)

### No Sensitive Data Stored
- ✅ No credit card numbers stored
- ✅ No CVV stored
- ✅ Only Stripe IDs stored for reference

---

## 🚀 Next Steps (Out of Scope)

The following features are NOT implemented yet:
- ❌ Invoices
- ❌ Refunds
- ❌ Taxes/Discounts
- ❌ Full Billing Service integration
- ❌ Subscription cancellation from UI
- ❌ Payment method management

---

## 📞 Support

If you encounter issues:
1. Check customer-api logs: `docker logs customer-api --tail 100`
2. Check gateway logs: `docker logs gateway-api --tail 100`
3. Check browser console for frontend errors
4. Verify all services are running: `docker ps`

---

## ✅ Success Criteria

Your integration is working correctly when:
1. ✅ You can browse offers
2. ✅ Subscribe button redirects to Stripe
3. ✅ Payment with test card succeeds
4. ✅ Webhook activates subscription
5. ✅ Admin can see active subscription with Stripe IDs

**Congratulations! Your Stripe subscription integration is complete! 🎉**
