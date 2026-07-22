# EnterpriseFlow - Mini ERP + CRM Operations Portal

## Setup Checklist
- [x] Phase 0: Scaffold (repo, backend skeleton, frontend skeleton, DB connected)
- [x] Phase 1: Auth & Roles (4 seeded users, login, role-based nav)
- [x] Phase 2: Customer CRM (CRUD, search, follow-ups)
- [x] Phase 3: Product & Inventory (CRUD, stock movements, low-stock alerts)
- [x] Phase 4: Sales Challan (draft/confirm/cancel, atomic stock, snapshots)
- [x] Phase 5: Polish (validation, error handling, responsive, Postman collection)
- [ ] Phase 6: Deployed (frontend + backend + DB live, CORS configured)
- [ ] Phase 7: Submission package assembled

### Progress: Backend 100% | Frontend 100% | Overall 90%

---

## 🎉 APPLICATION IS RUNNING!

**Backend:** http://localhost:5000 ✅ LIVE  
**Frontend:** http://localhost:5173 ✅ LIVE  
**MongoDB:** Local MongoDB 7.0.37 ✅ RUNNING  
**Database:** erp_crm_dev ✅ SEEDED (4 users, 4 customers, 8 products)

See [APPLICATION_STATUS.md](APPLICATION_STATUS.md) for complete details.

## Tech Stack
**Frontend:** React (Vite) + Tailwind CSS + React Router + Axios  
**Backend:** Node.js + Express.js + MongoDB (Mongoose) — plain JavaScript  
**Auth:** JWT

## Local Setup

⚠️ **Important:** See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

### Quick Setup (After prerequisites)
1. `cd backend && npm install && npm run seed && npm run dev`
2. `cd frontend && npm install && npm run dev`
3. Backend runs on http://localhost:5000, frontend on http://localhost:5173

### Prerequisites
- Node.js must be installed IN WSL (not Windows)
- MongoDB (Atlas or local installation)
- See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for details

## Environment Variables
See `.env.example` in each folder. Copy to `.env` and fill in real values for deployment.

## Test Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@enterpriseflow.com | admin123 |
| Sales | sales@enterpriseflow.com | sales123 |
| Warehouse | warehouse@enterpriseflow.com | warehouse123 |
| Accounts | accounts@enterpriseflow.com | accounts123 |

## Deployment
- **Frontend:** Vercel (to be deployed - see DEPLOY_NOW.md)
- **Backend:** Vercel (to be deployed - see DEPLOY_NOW.md)
- **Database:** MongoDB Atlas (free M0 cluster)

### Quick Deploy
See [DEPLOY_NOW.md](DEPLOY_NOW.md) for step-by-step deployment guide.

Deployment files ready:
- ✅ `backend/vercel.json` - Backend Vercel configuration
- ✅ `frontend/vercel.json` - Frontend Vercel configuration
- ✅ `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- ✅ `DEPLOY_NOW.md` - Quick 20-minute deployment steps

## Architecture Notes

### Frontend Architecture
- **React 18** with functional components and hooks only (no classes)
- **Vite** for fast dev server and build tooling
- **Tailwind CSS** with custom dark theme design system
- **React Router v6** for client-side routing with nested routes
- **Axios** for HTTP requests with centralized error handling and 401 interceptor
- **Context API** for authentication state (no Redux to keep it simple)
- **react-hot-toast** for user notifications

### Backend Architecture
- **Express.js** REST API with modular route structure
- **MongoDB + Mongoose** for data persistence with schema validation
- **JWT authentication** with role-based access control (RBAC) middleware
- **Atomic transactions** for stock operations and challan confirmation
- **Centralized error handling** with custom error classes
- **express-validator** for request validation on all endpoints

### Data Model Highlights
- **Challans** store customer and product snapshots to preserve historical pricing
- **Stock movements** are append-only logs linked to products for audit trail
- **Counters** collection manages auto-incrementing challan numbers per year
- **Follow-up notes** are embedded arrays in customer documents
- All timestamps use MongoDB's built-in createdAt/updatedAt

### Security
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days (configurable)
- All protected routes verify JWT and check role permissions
- CORS configured to allow only the frontend origin
- No sensitive data in error responses

### Role-Based Features
| Feature | Admin | Sales | Warehouse | Accounts |
|---------|-------|-------|-----------|----------|
| View Dashboard | ✓ | ✓ | ✓ | ✓ |
| Manage Customers | ✓ | ✓ | ✗ | Read-only |
| Manage Products | ✓ | ✗ | ✓ | Read-only |
| Manage Challans | ✓ | ✓ | ✗ | Read-only |
| Adjust Stock | ✓ | ✗ | ✓ | ✗ |

## Known Limitations
- **No user management UI** - Users must be added via seed script or direct database access
- **No PDF/invoice generation** - Challans are view-only in the web interface
- **No real-time updates** - Changes require manual page refresh (no WebSocket/polling)
- **Dashboard stats are client-computed** - Fetches list endpoints with limit=1 to get counts, not optimized aggregation queries
- **No image uploads** - Product images would require additional file storage setup
- **No email notifications** - Follow-up reminders are manual only
- **Token storage in memory** - Auth tokens lost on page refresh in current implementation (would need localStorage for persistence)
- **Basic pagination** - Uses offset-based pagination instead of cursor-based
- **No bulk operations** - All CRUD operations are one-at-a-time
- **No audit log UI** - Stock movements are logged but not exposed in a dedicated audit view

## Assumptions Made
- **MongoDB Atlas free tier (M0)** supports transactions needed for atomic stock operations
- **Auto-incrementing challan numbers** use format `CH-YYYY-XXXXXX` via a counters collection that resets each year
- **Stock movements are immutable** - append-only logs that are never edited or deleted
- **Challan snapshots preserve pricing** - product unit prices at time of challan creation are stored to maintain historical accuracy
- **Follow-up notes are embedded** - stored as arrays within customer documents (acceptable for moderate volume)
- **Single currency** - all prices in Indian Rupees (₹), no multi-currency support
- **No timezone handling** - all dates use server timezone (would need moment-timezone or similar for production)
- **Small dataset assumption** - dashboard queries fetch and filter client-side (okay for demo, would need backend aggregations at scale)
- **Trust client-side role checks for UI** - server always enforces RBAC, but frontend also hides buttons to improve UX
- **Mobile-responsive but not mobile-first** - designed for desktop/tablet, usable on mobile but not optimized
