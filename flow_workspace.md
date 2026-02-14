# Slotify Backend API Documentation

**Base URL:** `http://127.0.0.1:8000/api/`

This document explains how the React frontend should interact with the backend for:

* Workspace (Tenant) management
* User registration
* User login
* Workspace dashboard access

---

# 1. Create Workspace

Creates a new workspace.

**Endpoint**

```
POST /api/workspaces/create/
```

**Request Body**

```json
{
  "name": "Apollo Clinic",
  "tenant_type": "DOCTOR",
  "email": "apollo@gmail.com",
  "phone": "9999999999"
}
```

**Response**

```json
{
  "message": "Workspace created successfully",
  "workspace": {
    "id": "uuid",
    "name": "Apollo Clinic",
    "slug": "apollo-clinic",
    "tenant_type": "DOCTOR",
    "email": "apollo@gmail.com",
    "phone": "9999999999"
  }
}
```

**Frontend Flow**

Save:

```
workspace.id
workspace.slug
```

You will need these for registration and dashboard routing.

---

# 2. List All Workspaces

Returns all workspaces.

**Endpoint**

```
GET /api/workspaces/
```

**Response**

```json
[
  {
    "id": "uuid",
    "name": "Apollo Clinic",
    "slug": "apollo-clinic",
    "tenant_type": "DOCTOR",
    "email": "apollo@gmail.com",
    "phone": "9999999999"
  }
]
```

**Frontend Usage**

Used for:

* Workspace selection page
* Workspace dashboard list

---

# 3. Get Workspace Details (Slug-based)

Fetch specific workspace using slug.

**Endpoint**

```
GET /api/workspaces/{slug}/
```

**Example**

```
GET /api/workspaces/apollo-clinic/
```

**Response**

```json
{
  "id": "uuid",
  "name": "Apollo Clinic",
  "slug": "apollo-clinic",
  "tenant_type": "DOCTOR",
  "email": "apollo@gmail.com",
  "phone": "9999999999"
}
```

**Frontend Usage**

React route example:

```
/workspace/apollo-clinic
```

Fetch workspace data using slug.

---

# 4. Register User

Creates a new user linked to workspace.

**Endpoint**

```
POST /api/auth/register/
```

**Request Body**

```json
{
  "email": "user@gmail.com",
  "password": "securepassword",
  "workspace_id": "workspace_uuid"
}
```

**Response**

```json
{
  "message": "Account created successfully",
  "user_id": "uuid"
}
```

**Frontend Flow**

After workspace creation:

1. Call register API
2. Pass workspace_id
3. Redirect to login

---

# 5. Login User

Authenticates user.

**Endpoint**

```
POST /api/auth/login/
```

**Request Body**

```json
{
  "email": "user@gmail.com",
  "password": "securepassword"
}
```

**Response**

```json
{
  "message": "Login successful",
  "user_id": "uuid",
  "workspace_id": "uuid",
  "workspace_slug": "apollo-clinic"
}
```

**Frontend Flow**

After login:

Redirect user to:

```
/workspace/apollo-clinic/dashboard
```

---

# 6. Recommended React Routes

```
/create-workspace
/register
/login
/workspace/:slug
/workspace/:slug/dashboard
```

Example:

```
/workspace/apollo-clinic/dashboard
```

---

# 7. Full Frontend Flow Diagram

```
Create Workspace
    ↓
Receive workspace_id & slug
    ↓
Register User using workspace_id
    ↓
Login User
    ↓
Receive workspace_slug
    ↓
Redirect to:
   /workspace/{slug}/dashboard
    ↓
Fetch workspace details using slug API
```

---

# 8. Workspace Types

Allowed values:

```
DOCTOR
MENTOR
FREELANCER
TEACHER
COMPANY
```

Frontend must send exact value.

---

# 9. Example React Fetch

Create Workspace:

```javascript
await fetch("/api/workspaces/create/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Apollo Clinic",
    tenant_type: "DOCTOR"
  })
});
```

---

# Summary

Backend provides:

* Workspace creation
* Workspace listing
* Workspace detail via slug
* User registration
* User login

Frontend handles:

* Forms
* Routing
* Dashboard UI
* Storing workspace slug

```
```