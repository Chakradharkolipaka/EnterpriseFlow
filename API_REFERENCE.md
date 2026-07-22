# EnterpriseFlow API Reference

Base URL (Local): `http://localhost:5000/api`  
Base URL (Production): `https://your-backend.vercel.app/api`

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### POST /auth/login
**Public** - Authenticate user and get JWT token

**Request:**
```json
{
  "email": "admin@enterpriseflow.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@enterpriseflow.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  },
  "message": "Login successful"
}
```

---

## Customers

### GET /customers
**Roles:** admin, sales, accounts

**Query Params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search in name, mobile, email, businessName
- `status` - Filter by status (Lead/Active/Inactive)
- `type` - Filter by customerType (Retail/Wholesale/Distributor)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 50,
    "page": 1,
    "totalPages": 3
  }
}
```

### GET /customers/:id
**Roles:** admin, sales, accounts

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "businessName": "John's Store",
    "address": "123 Main St",
    "customerType": "Retail",
    "status": "Active",
    "followUpDate": "2026-07-25T00:00:00.000Z",
    "notes": [
      {
        "text": "Follow up next week",
        "createdBy": {...},
        "createdAt": "2026-07-22T..."
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### POST /customers
**Roles:** admin, sales

**Request:**
```json
{
  "name": "John Doe",
  "mobile": "9876543210",
  "email": "john@example.com",
  "businessName": "John's Store",
  "address": "123 Main St",
  "customerType": "Retail",
  "status": "Lead",
  "followUpDate": "2026-07-25"
}
```

### PUT /customers/:id
**Roles:** admin, sales

**Request:** Same as POST (all fields optional except constraints)

### POST /customers/:id/followups
**Roles:** admin, sales

**Request:**
```json
{
  "text": "Called customer, will visit next week"
}
```

---

## Products

### GET /products
**Roles:** all roles

**Query Params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search in name, sku, category
- `category` - Filter by category
- `lowStock` - "true" to show only low stock products

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "totalPages": 5
  }
}
```

### GET /products/:id
**Roles:** all roles

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Laptop HP 15s",
    "sku": "LAP-001",
    "category": "Gadgets",
    "unitPrice": 45000,
    "currentStock": 25,
    "minStockAlert": 10,
    "description": "15.6 inch laptop",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### POST /products
**Roles:** admin, warehouse

**Request:**
```json
{
  "name": "Laptop HP 15s",
  "sku": "LAP-001",
  "category": "Gadgets",
  "unitPrice": 45000,
  "currentStock": 25,
  "minStockAlert": 10,
  "description": "15.6 inch laptop"
}
```

### PUT /products/:id
**Roles:** admin, warehouse

**Request:** Same as POST (currentStock cannot be updated here, use stock adjustment)

### POST /products/:id/stock
**Roles:** admin, warehouse  
**Description:** Adjust stock with atomic transaction

**Request:**
```json
{
  "quantity": 50,
  "movementType": "IN",
  "reason": "Purchase from supplier"
}
```
or
```json
{
  "quantity": 10,
  "movementType": "OUT",
  "reason": "Damaged goods"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Updated product with new currentStock
  },
  "message": "Stock adjusted successfully"
}
```

**Error (Insufficient Stock):**
```json
{
  "success": false,
  "message": "Insufficient stock. Current: 5, Requested: 10"
}
```

### GET /products/:id/stock-log
**Roles:** all roles

**Query Params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "...",
        "product": "...",
        "quantityChanged": 50,
        "movementType": "IN",
        "reason": "Purchase from supplier",
        "createdBy": {
          "name": "Admin User",
          "email": "admin@example.com",
          "role": "admin"
        },
        "timestamp": "2026-07-22T..."
      }
    ],
    "total": 25,
    "page": 1,
    "totalPages": 3
  }
}
```

---

## Challans

### GET /challans
**Roles:** admin, sales, accounts

**Query Params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status (Draft/Confirmed/Cancelled)
- `customer` - Filter by customer ID

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "...",
        "challanNumber": "CH-2026-000001",
        "customer": {
          "name": "John Doe",
          "mobile": "9876543210"
        },
        "customerSnapshot": {...},
        "products": [...],
        "totalQuantity": 15,
        "status": "Confirmed",
        "createdBy": {...},
        "createdAt": "..."
      }
    ],
    "total": 30,
    "page": 1,
    "totalPages": 2
  }
}
```

### GET /challans/:id
**Roles:** admin, sales, accounts

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "challanNumber": "CH-2026-000001",
    "customer": {...},
    "customerSnapshot": {
      "name": "John Doe",
      "mobile": "9876543210",
      "businessName": "John's Store"
    },
    "products": [
      {
        "product": "...",
        "name": "Laptop HP 15s",
        "sku": "LAP-001",
        "unitPrice": 45000,
        "quantity": 2
      }
    ],
    "totalQuantity": 2,
    "status": "Confirmed",
    "createdBy": {...},
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### POST /challans
**Roles:** admin, sales

**Request (Create as Draft):**
```json
{
  "customer": "customer_id_here",
  "products": [
    {
      "product": "product_id_1",
      "quantity": 5
    },
    {
      "product": "product_id_2",
      "quantity": 3
    }
  ],
  "confirmImmediately": false
}
```

**Request (Create and Confirm):**
```json
{
  "customer": "customer_id_here",
  "products": [
    {
      "product": "product_id_1",
      "quantity": 5
    }
  ],
  "confirmImmediately": true
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Challan object
  },
  "message": "Challan created successfully as Draft"
}
```

**Error (Insufficient Stock):**
```json
{
  "success": false,
  "message": "Insufficient stock for one or more products",
  "errors": [
    "Laptop HP 15s (LAP-001): Required 10, Available 5",
    "Mouse Logitech (MOU-001): Required 20, Available 15"
  ]
}
```

### PUT /challans/:id
**Roles:** admin, sales  
**Note:** Only Draft challans can be edited

**Request:**
```json
{
  "products": [
    {
      "product": "product_id_1",
      "quantity": 10
    }
  ]
}
```

### POST /challans/:id/confirm
**Roles:** admin, sales  
**Description:** Confirm a Draft challan (deducts stock)

**Response:**
```json
{
  "success": true,
  "data": {
    // Updated challan with status "Confirmed"
  },
  "message": "Challan confirmed successfully"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Insufficient stock for one or more products",
  "errors": [...]
}
```

### POST /challans/:id/cancel
**Roles:** admin, sales  
**Description:** Cancel a challan (restores stock if it was Confirmed)

**Response:**
```json
{
  "success": true,
  "data": {
    // Updated challan with status "Cancelled"
  },
  "message": "Challan cancelled successfully"
}
```

---

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response (400/404/422)
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["detail 1", "detail 2"]
}
```

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "mobile": "Mobile must be 10 digits"
  }
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "You don't have permission to perform this action"
}
```

---

## Role Permission Matrix

| Endpoint | admin | sales | warehouse | accounts |
|----------|-------|-------|-----------|----------|
| POST /auth/login | ✓ | ✓ | ✓ | ✓ |
| GET /customers | ✓ | ✓ | ✗ | ✓ |
| POST /customers | ✓ | ✓ | ✗ | ✗ |
| PUT /customers/:id | ✓ | ✓ | ✗ | ✗ |
| POST /customers/:id/followups | ✓ | ✓ | ✗ | ✗ |
| GET /products | ✓ | ✓ | ✓ | ✓ |
| POST /products | ✓ | ✗ | ✓ | ✗ |
| PUT /products/:id | ✓ | ✗ | ✓ | ✗ |
| POST /products/:id/stock | ✓ | ✗ | ✓ | ✗ |
| GET /products/:id/stock-log | ✓ | ✓ | ✓ | ✓ |
| GET /challans | ✓ | ✓ | ✗ | ✓ |
| POST /challans | ✓ | ✓ | ✗ | ✗ |
| PUT /challans/:id | ✓ | ✓ | ✗ | ✗ |
| POST /challans/:id/confirm | ✓ | ✓ | ✗ | ✗ |
| POST /challans/:id/cancel | ✓ | ✓ | ✗ | ✗ |

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'
```

### Get Customers (with token)
```bash
curl -X GET http://localhost:5000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Customer",
    "mobile":"9876543210",
    "customerType":"Retail",
    "status":"Lead"
  }'
```

### Adjust Stock
```bash
curl -X POST http://localhost:5000/api/products/PRODUCT_ID/stock \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity":50,
    "movementType":"IN",
    "reason":"Purchase from supplier"
  }'
```

---

## Postman Collection

Import the Postman collection from `postman/ERP-CRM.postman_collection.json` for a complete set of pre-configured requests with examples.

---

Generated: 2026-07-22  
Version: 1.0
