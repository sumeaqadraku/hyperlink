# Telecom Web App - Frontend

React-based frontend for the Telecom Services microservices application.

## Technology Stack

- React 18
- TypeScript
- Vite (Build tool)
- React Router (Routing)
- Axios (HTTP client)
- TanStack Query (Data fetching)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_API_URL=http://localhost:5000
```

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── services/        # API service layer
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## API Integration

The frontend connects to the backend through the API Gateway (port 5000) which routes requests to:

- `/api/catalog/*` → Catalog Service (port 8001)
- `/api/billing/*` → Billing Service (port 8002)
- `/api/customer/*` → Customer Service (port 8003)
- `/api/provisioning/*` → Provisioning Service (port 8004)
