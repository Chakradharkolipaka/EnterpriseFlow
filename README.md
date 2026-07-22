# EnterpriseFlow - Mini ERP + CRM Operations Portal

## Setup Checklist
- [x] Phase 0: Scaffold (repo, backend skeleton, frontend skeleton, DB connected)
- [x] Phase 1: Auth & Roles (4 seeded users, login, role-based nav) - **Backend & Frontend Login Complete**
- [x] Phase 2: Customer CRM (CRUD, search, follow-ups) - **Backend Complete**
- [x] Phase 3: Product & Inventory (CRUD, stock movements, low-stock alerts) - **Backend Complete**
- [x] Phase 4: Sales Challan (draft/confirm/cancel, atomic stock, snapshots) - **Backend Complete**
- [ ] Phase 5: Polish (validation, error handling, responsive, Postman collection) - **Frontend UI Needed**
- [ ] Phase 6: Deployed (frontend + backend + DB live, CORS configured)
- [ ] Phase 7: Submission package assembled

### Progress: Backend 100% | Frontend 20% | Overall 60%

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
- **Frontend:** Vercel — (URL to be added)
- **Backend:** Render — (URL to be added)
- **Database:** MongoDB Atlas (free M0 cluster)

## Architecture Notes
The application follows a clean separation between frontend and backend. The React frontend communicates with the Express REST API via JWT-based authentication. MongoDB stores all data with Mongoose ODM providing schema validation. Role-based access control is enforced at the API level through middleware. Sales challans use atomic transactions to ensure stock integrity during confirmation/cancellation operations.

## Known Limitations
- No user management UI (users are seeded via script)
- No PDF export for challans/invoices
- No real-time notifications or WebSocket support
- Basic pagination without cursor-based approach
- Token stored in memory (lost on page refresh in MVP)

## Assumptions Made
- Using MongoDB Atlas free tier (M0) which supports transactions
- Auto-incrementing challan numbers per year using a separate counters collection
- Stock movements are append-only and never deleted
- Challan product snapshots preserve historical pricing
- Follow-up notes are append-only arrays within customer documents
