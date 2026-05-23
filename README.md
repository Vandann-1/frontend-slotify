# Slotify Merchant and Professional Portal

This is the React-based merchant, professional, and administrator portal for the Slotify multi-tenant scheduling platform. Built with React, Vite, and TailwindCSS, it allows professionals to manage their custom workspaces, configure service lists, establish availability blocks, view operational dashboards, manage team memberships, and orchestrate billing plans.

---

## 1. Project Setup and Local Run Guide

Follow these steps to set up and launch the portal on your development machine:

### Installation
From the frontend root directory (V:/slotify-front/frontend), install all package dependencies:
```bash
npm install
```

### Configure Environment variables
Create a `.env` file in the frontend root directory (V:/slotify-front/frontend/.env) to point Vite to the Django backend server:
```ini
VITE_API_URL=http://127.0.0.1:8000
```

### Launch Development Server
To launch the Vite development server locally:
```bash
npm run dev
```
The application will boot up and be accessible in your web browser at: http://localhost:5173

### Build for Production
To compile the application into minified, production-ready static assets:
```bash
npm run build
```
The compiled output will be generated inside the `dist/` directory.

---

## 2. Directory Architecture

The frontend is designed around a modular feature-based structure to ensure robust scalability:

```text
frontend/
├── src/
│   ├── api/             # Centralized Axios client and API calls (auth, workspaces, etc.)
│   ├── assets/          # Static assets (images, logos, icons)
│   ├── components/      # Common shared UI components
│   ├── features/        # Feature-driven business logic modules
│   │   ├── Plans/       # Subscription plans pages
│   │   ├── Team/        # Workspace team member listings
│   │   ├── auth/        # Login, registration, and onboarding flows
│   │   ├── dashboard/   # Workspace list & merchant admin views
│   │   ├── invite/      # Accepting and validating invitation tokens
│   │   └── professional/# Professional workspace view dashboards
│   ├── fields/          # Shared input fields and form elements
│   ├── layouts/         # Base layout shells (e.g. MainLayout with header/footer)
│   ├── styles/          # Custom global CSS styles
│   └── utils/           # Helper functions and formatting utilities
├── .env                 # Environment config file
├── vite.config.js       # Vite build configurations
└── tailwind.config.js   # Tailwind style rules and design tokens
```

---

## 3. Core Onboarding and Workspace Workflow

The integration flow between the frontend and the Django backend is structured into a precise multi-step lifecycle:

```text
Step 1: Create Workspace
   |
   +---> Sends workspace name, template type, phone, and email to POST /api/workspaces/
   +---> Receives unique "workspace_id" and "slug" (e.g., apollo-clinic)
   |
Step 2: Register Admin User
   |
   +---> Renders registration form, sends details with the "workspace_id" to POST /api/auth/register/
   |
Step 3: Login Authentication
   |
   +---> Authenticates credentials via POST /api/auth/login/
   +---> Receives and saves JWT access/refresh tokens in localStorage
   +---> Receives "workspace_slug" representing the user's active tenant
   |
Step 4: Redirect to Dashboard
   |
   +---> Routes user to /admin/workspace/{workspace_slug}/overview
   +---> Automatically attaches JWT token to headers for subsequent secure operations
```

---

## 4. Frontend Route Inventory

All route definitions are configured in `App.jsx` using `react-router-dom`:

### Public Routes
* `/` - Landing page.
* `/login` - Professional login panel.
* `/register` - Onboarding registration panel.
* `/invite-accept/:token` - Validation landing page for invited team members.

### Secure Workspace Administrative Routes
All sub-routes require a valid JWT token to gain access:
* `/workspaces` - Workspace selection screen (lists all owned/joined spaces).
* `/create-dashboard` - Form to setup a new workspace.
* `/plans` - Subscriptions page to select pricing tiers.
* `/admin/workspace/:slug/:page/:id?` - Unified workspace management portal.
  * `:slug`: The tenant's identifier (e.g. `apollo-clinic`).
  * `:page`: Sub-pages (e.g. `overview`, `services`, `availability`, `bookings`, `members`).
  * `:id`: Optional identifier parameter for sub-items.

### Secure Professional Portal Routes
* `/professional/workspace/:slug/:page/:id?` - Portal dashboard specifically customized for team members and professionals without full administrative controls.

---

## 5. Centralized API Integration (Axios)

To prevent security leaks and keep codebase changes minimal, all endpoints are accessed through a centralized Axios client:
File Path: `src/api/axiosInstance.js`

### Key Integration Points
* **Environment Resolving**: Automatically selects `VITE_API_URL` from the `.env` configuration file, defaulting to `http://127.0.0.1:8000` if undefined.
* **Request Interceptor**: Automatically attaches the current JWT token (`Bearer <token>`) from `localStorage` on all outbound API requests, securely bypassing public endpoints like `/login` or `/register`.
* **Response Interceptor**: Automatically monitors inbound status codes. If a `401 Unauthorized` token expiry occurs, the interceptor clears local credentials and safely redirects the user's browser back to `/login`.
