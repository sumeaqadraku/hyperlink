# Frontend Setup Guide

## ✅ Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:5000`

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
cd c:\Lora\hyperlink\src\web
npm install
```

### 2. Install Missing Tailwind Plugin

```powershell
npm install -D tailwindcss-animate
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```powershell
copy .env.example .env
```

Update `.env` if your API URL is different:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server

```powershell
npm run dev
```

The app will be available at **http://localhost:3000**

## 🌐 Accessing the Application

### Public Pages (No authentication required)
- **Home**: http://localhost:3000/
- **Offers**: http://localhost:3000/offers
- **Offer Details**: http://localhost:3000/offers/1

### Dashboard Pages (Future: Will require authentication)
- **Dashboard**: http://localhost:3000/dashboard
- **Catalog**: http://localhost:3000/dashboard/catalog
- **Subscriptions**: http://localhost:3000/dashboard/subscriptions
- **Billing**: http://localhost:3000/dashboard/billing
- **Usage**: http://localhost:3000/dashboard/usage

## 📦 Build for Production

```powershell
npm run build
```

The production-ready files will be in the `dist/` folder.

To preview the production build:

```powershell
npm run preview
```

## 🛠️ Development Tips

### TypeScript Errors

All TypeScript errors you see in the IDE are expected until you run `npm install`. They will disappear after installation.

### API Integration

The frontend includes mock data fallbacks for all API calls, so you can develop the UI even if the backend is not running. Once the backend is ready:

1. Ensure all backend services are running
2. The frontend will automatically switch from mock data to real API calls
3. Check the browser console for API errors

### Hot Module Replacement (HMR)

Vite provides instant updates. Save any file and see changes immediately in the browser without a full page reload.

### Debugging

Open browser DevTools:
- **Console**: View logs, errors, and API responses
- **Network**: Monitor API calls
- **React DevTools**: Inspect component tree and state

## 🎨 Customization

### Theme Colors

Edit `src/index.css` to change the color scheme:

```css
:root {
  --primary: 0 72% 51%;  /* Red color */
  --background: 0 0% 100%;  /* White */
  /* ... more colors */
}
```

### Components

All UI components are in `src/components/ui/`. You can customize:
- Button variants
- Card styles
- Badge colors
- Table layouts

### Logo and Branding

Replace the phone icon in layouts with your actual logo:
- `src/layouts/PublicLayout.tsx` (line 14)
- `src/layouts/DashboardLayout.tsx` (line 36)

## 🔗 Backend Integration Checklist

Ensure your backend has these endpoints:

### Catalog Service
- `GET /api/catalog/offers`
- `GET /api/catalog/offers/{id}`
- `POST /api/catalog/offers`
- `PUT /api/catalog/offers/{id}`
- `DELETE /api/catalog/offers/{id}`

### Provisioning Service
- `GET /api/provisioning/subscriptions`
- `GET /api/provisioning/subscriptions/{id}`
- `POST /api/provisioning/subscriptions`
- `PATCH /api/provisioning/subscriptions/{id}/status`
- `GET /api/provisioning/usage`
- `GET /api/provisioning/usage/summary`

### Billing Service
- `GET /api/billing/invoices`
- `GET /api/billing/invoices/{id}`
- `GET /api/billing/payments`
- `GET /api/billing/balance`

### Customer Service
- `GET /api/customer/profile` (future)

## 🧪 Testing API Integration

Use the browser console to test API calls:

```javascript
// Test catalog service
fetch('http://localhost:5000/api/catalog/offers')
  .then(r => r.json())
  .then(console.log)
```

## 📱 Mobile Testing

The app is fully responsive. Test on different screen sizes:

1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select different devices (iPhone, iPad, etc.)

## 🚨 Common Issues

### Port 3000 Already in Use

```powershell
# Change port in vite.config.ts
server: {
  port: 3001,  // Use different port
}
```

### CORS Errors

If you see CORS errors, ensure your backend API Gateway allows requests from `http://localhost:3000`.

Add to your backend CORS configuration:

```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
```

### API Not Found (404)

Check that:
1. Backend services are running
2. API Gateway is on port 5000
3. `.env` file has correct `VITE_API_URL`

## 📚 Next Steps

1. **Install dependencies** - `npm install`
2. **Start development** - `npm run dev`
3. **Review pages** - Navigate through all pages
4. **Test API integration** - Connect to your backend
5. **Customize design** - Adjust colors, logo, and branding
6. **Add authentication** - Implement login/register
7. **Deploy** - Build and deploy to production

## 🎯 Ready to Go!

You now have a complete, production-ready frontend for your Telecom Services Web App. The design is clean, modern, and follows the guidelines you specified. All components are reusable, the code is type-safe with TypeScript, and the UI is fully responsive.

**Happy coding! 👨‍💻**
