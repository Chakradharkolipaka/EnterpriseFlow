# EnterpriseFlow - Testing Guide

This guide walks you through testing all features of the application.

## Prerequisites

1. **Backend running** on http://localhost:5000
2. **Frontend running** on http://localhost:5173
3. **Database seeded** with test data (run `npm run seed` in backend folder)

---

## Test Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@enterpriseflow.com | admin123 | Full access to everything |
| Sales | sales@enterpriseflow.com | sales123 | Customers + Challans |
| Warehouse | warehouse@enterpriseflow.com | warehouse123 | Products only |
| Accounts | accounts@enterpriseflow.com | accounts123 | Read-only access |

---

## Test Plan

### 1. Authentication & Authorization (10 mins)

#### Test 1.1: Login Flow
- [ ] Open http://localhost:5173
- [ ] Verify redirect to login page
- [ ] Login with admin@enterpriseflow.com / admin123
- [ ] Verify redirect to dashboard
- [ ] Check that user name appears in topbar

#### Test 1.2: Role-Based Navigation
- [ ] Login as **Admin** - should see: Dashboard, Customers, Products, Challans
- [ ] Logout and login as **Sales** - should see: Dashboard, Customers, Challans (no Products)
- [ ] Logout and login as **Warehouse** - should see: Dashboard, Products (no Customers/Challans)
- [ ] Logout and login as **Accounts** - should see: Dashboard, Customers, Products, Challans

#### Test 1.3: Protected Routes
- [ ] Login as **Warehouse**
- [ ] Try to navigate to `/customers` directly in URL
- [ ] Should be redirected or see "Access Denied"
- [ ] Navigate to `/products` - should work

---

### 2. Dashboard (5 mins)

#### Test 2.1: Admin Dashboard
- [ ] Login as **Admin**
- [ ] Verify stat cards show numbers (not "--" or "Loading...")
- [ ] Check "Low Stock Alerts" panel shows products
- [ ] Check "Recent Challans" panel shows challans

#### Test 2.2: Role-Specific Stats
- [ ] Login as **Sales** - should see Customer/Challan stats
- [ ] Login as **Warehouse** - should see Product/Stock stats only
- [ ] Login as **Accounts** - should see all stats but no action buttons

---

### 3. Customer Module (15 mins)

#### Test 3.1: Customer List
- [ ] Login as **Admin** or **Sales**
- [ ] Navigate to Customers
- [ ] Verify table shows 4 customers (from seed data)
- [ ] Test search: type "kumar" - should filter results
- [ ] Test status filter: select "Active" - should filter
- [ ] Test type filter: select "Retail" - should filter
- [ ] Click "View" on a customer

#### Test 3.2: Customer Detail
- [ ] Verify customer details display correctly
- [ ] Verify "Edit Customer" button appears (Admin/Sales only)
- [ ] Scroll to Follow-up Notes section
- [ ] Type a note: "Test follow-up note"
- [ ] Click "Add Note"
- [ ] Verify note appears immediately without page refresh
- [ ] Verify note shows your name and timestamp

#### Test 3.3: Create Customer
- [ ] Click "Add Customer" button
- [ ] Leave name empty and submit
- [ ] Verify "Name is required" error
- [ ] Fill form:
  - Name: "Test Customer"
  - Mobile: "9876543210"
  - Email: "test@example.com"
  - Business: "Test Business"
  - Type: "Wholesale"
  - Status: "Lead"
- [ ] Click "Create Customer"
- [ ] Verify redirect to customer detail page
- [ ] Verify success toast appears

#### Test 3.4: Edit Customer
- [ ] From customer detail, click "Edit Customer"
- [ ] Change status to "Active"
- [ ] Click "Update Customer"
- [ ] Verify redirect back to detail page
- [ ] Verify status updated

#### Test 3.5: Read-Only Access (Accounts)
- [ ] Logout and login as **Accounts**
- [ ] Navigate to Customers
- [ ] Verify "Add Customer" button is hidden
- [ ] Click "View" on a customer
- [ ] Verify "Edit Customer" button is hidden
- [ ] Verify "Add Note" form is hidden

---

### 4. Product Module (20 mins)

#### Test 4.1: Product List
- [ ] Login as **Admin** or **Warehouse**
- [ ] Navigate to Products
- [ ] Verify table shows 8 products (from seed data)
- [ ] Test search: type "laptop" - should filter
- [ ] Test category filter: select "Gadgets"
- [ ] Check "Show Low Stock Only" checkbox
- [ ] Verify only products with stock ≤ min alert show

#### Test 4.2: Product Detail
- [ ] Click "View" on a product
- [ ] Verify product details display
- [ ] Verify "Adjust Stock" and "Edit Product" buttons appear
- [ ] Verify stock movement history shows at bottom
- [ ] Verify pagination works if >10 movements

#### Test 4.3: Stock Adjustment - Stock IN
- [ ] From product detail, click "Adjust Stock"
- [ ] Select "Stock In (Add)"
- [ ] Enter quantity: 50
- [ ] Enter reason: "Purchase from supplier"
- [ ] Click "Adjust Stock"
- [ ] Verify modal closes
- [ ] Verify current stock increased by 50
- [ ] Verify new entry in stock movement history

#### Test 4.4: Stock Adjustment - Stock OUT (Success)
- [ ] Click "Adjust Stock" again
- [ ] Select "Stock Out (Remove)"
- [ ] Enter quantity: 10
- [ ] Enter reason: "Damaged goods"
- [ ] Click "Adjust Stock"
- [ ] Verify stock decreased by 10

#### Test 4.5: Stock Adjustment - Insufficient Stock
- [ ] Click "Adjust Stock"
- [ ] Select "Stock Out (Remove)"
- [ ] Enter quantity: 99999 (more than available)
- [ ] Enter reason: "Test"
- [ ] Click "Adjust Stock"
- [ ] Verify error message shows specific stock available
- [ ] Verify modal does NOT close
- [ ] Click "Cancel" to close modal

#### Test 4.6: Create Product
- [ ] Click "Add Product"
- [ ] Fill form:
  - Name: "Test Product"
  - SKU: "TEST-001"
  - Category: "Gadgets"
  - Unit Price: 1500
  - Initial Stock: 100
  - Min Stock Alert: 20
  - Description: "Test description"
- [ ] Click "Create Product"
- [ ] Verify redirect to product detail
- [ ] Verify all fields saved correctly

#### Test 4.7: Edit Product
- [ ] Click "Edit Product"
- [ ] Change unit price to 1600
- [ ] Try to change current stock - field should be disabled with info message
- [ ] Click "Update Product"
- [ ] Verify price updated
- [ ] Verify stock unchanged (only adjustable via Adjust Stock)

---

### 5. Challan Module (25 mins)

#### Test 5.1: Challan List
- [ ] Login as **Admin** or **Sales**
- [ ] Navigate to Challans
- [ ] Verify table shows challans
- [ ] Test status filter: select "Draft", then "Confirmed"
- [ ] Click "View" on a challan

#### Test 5.2: Challan Detail
- [ ] Verify challan number (format: CH-2026-XXXXXX)
- [ ] Verify customer snapshot displays
- [ ] Verify products table with correct prices
- [ ] Verify grand total calculates correctly
- [ ] Note the challan status badge

#### Test 5.3: Create Challan - Draft
- [ ] Click "Create Challan"
- [ ] Select customer from dropdown
- [ ] Click "Add Product" to add 2nd line
- [ ] For line 1:
  - Select a product
  - Enter quantity: 5
- [ ] For line 2:
  - Select different product
  - Enter quantity: 3
- [ ] Verify line totals calculate
- [ ] Verify grand total updates
- [ ] Click "Save as Draft"
- [ ] Verify redirect to challan detail
- [ ] Verify status is "Draft"

#### Test 5.4: Confirm Draft Challan
- [ ] From a Draft challan detail page
- [ ] Note current stock of products before confirming
- [ ] Click "Confirm" button
- [ ] Click "Confirm Challan" in modal
- [ ] Verify status changes to "Confirmed"
- [ ] Navigate to Products
- [ ] Verify stock deducted for challan products

#### Test 5.5: Create Challan - Confirm Immediately
- [ ] Click "Create Challan"
- [ ] Select customer
- [ ] Add products with quantities
- [ ] Click "Confirm & Create"
- [ ] Verify challan created with "Confirmed" status
- [ ] Verify stock immediately deducted

#### Test 5.6: Insufficient Stock Error
- [ ] Click "Create Challan"
- [ ] Select customer
- [ ] Select a product
- [ ] Enter quantity larger than available stock (check product list first)
- [ ] Click "Confirm & Create"
- [ ] Verify specific error message shows which product has insufficient stock
- [ ] Verify error appears on the product line, not just generic toast
- [ ] Reduce quantity to valid amount
- [ ] Click "Confirm & Create" again
- [ ] Verify success

#### Test 5.7: Multi-Product Insufficient Stock
- [ ] Create challan with 3 products
- [ ] Make 2 of them have insufficient quantities
- [ ] Click "Confirm & Create"
- [ ] Verify both products show errors
- [ ] Fix one product quantity
- [ ] Click again
- [ ] Verify only remaining product shows error

#### Test 5.8: Cancel Confirmed Challan
- [ ] Open a Confirmed challan
- [ ] Note product stocks before cancelling
- [ ] Click "Cancel" button
- [ ] Click "Cancel Challan" in modal
- [ ] Verify status changes to "Cancelled"
- [ ] Navigate to Products
- [ ] Verify stock restored

#### Test 5.9: Cancel Draft Challan
- [ ] Open a Draft challan
- [ ] Click "Cancel"
- [ ] Confirm cancellation
- [ ] Verify status changes to "Cancelled"
- [ ] Verify no stock changes (draft never deducted)

#### Test 5.10: Remove Line Item
- [ ] Start creating a challan
- [ ] Add 3 product lines
- [ ] Click X button on 2nd line
- [ ] Verify line removed
- [ ] Try to remove the last remaining line
- [ ] Verify error: "At least one product is required"

---

### 6. Edge Cases & Error Handling (10 mins)

#### Test 6.1: Network Errors
- [ ] Stop the backend server
- [ ] Try to load customer list
- [ ] Verify error toast appears
- [ ] Start backend server
- [ ] Refresh page - should work

#### Test 6.2: Invalid Form Data
- [ ] Try to create customer with mobile: "abc"
- [ ] Verify validation error
- [ ] Try email: "notanemail"
- [ ] Verify validation error
- [ ] Fix and submit successfully

#### Test 6.3: Session Expiry (401 handling)
- [ ] Login and note JWT token from browser devtools
- [ ] Wait for token to expire (7 days in production, but you can test by manually deleting token from context)
- [ ] Try to perform any action
- [ ] Should auto-logout and redirect to login

#### Test 6.4: Duplicate SKU
- [ ] Try to create product with SKU that already exists
- [ ] Verify backend returns error
- [ ] Verify error message displayed to user

---

### 7. UI/UX Testing (10 mins)

#### Test 7.1: Loading States
- [ ] Refresh any list page
- [ ] Verify skeleton loaders appear before data loads
- [ ] Open any detail page
- [ ] Verify loading state before content appears

#### Test 7.2: Empty States
- [ ] Filter customers to show no results
- [ ] Verify "No customers found" message appears
- [ ] Clear filters
- [ ] Verify data returns

#### Test 7.3: Responsive Design
- [ ] Open browser devtools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test at 375px (mobile)
  - [ ] Sidebar should collapse or adapt
  - [ ] Tables should scroll horizontally
  - [ ] Forms should stack vertically
- [ ] Test at 768px (tablet)
  - [ ] Layout should adapt
- [ ] Test at 1440px (desktop)
  - [ ] Full layout visible

#### Test 7.4: Toast Notifications
- [ ] Perform any create/update/delete action
- [ ] Verify toast appears in top-right
- [ ] Verify toast auto-dismisses after ~3 seconds
- [ ] Verify success toasts are green
- [ ] Verify error toasts are red

---

## Test Results Template

```
Date: _____________
Tester: _____________
Environment: Local / Production

✅ Authentication & Authorization: PASS / FAIL
✅ Dashboard: PASS / FAIL
✅ Customer Module: PASS / FAIL
✅ Product Module: PASS / FAIL
✅ Challan Module: PASS / FAIL
✅ Edge Cases: PASS / FAIL
✅ UI/UX: PASS / FAIL

Critical Issues Found:
1. _____________
2. _____________

Minor Issues Found:
1. _____________
2. _____________

Overall Status: PASS / FAIL

Notes:
_____________________________________________
_____________________________________________
```

---

## Automated Testing (Future)

Currently, the application uses manual testing. For production, consider adding:

- **Unit tests** - Jest + React Testing Library for components
- **Integration tests** - Supertest for API endpoints
- **E2E tests** - Cypress or Playwright for full user flows
- **Performance tests** - Lighthouse for frontend performance
- **Security tests** - OWASP ZAP for vulnerability scanning

---

## Bug Reporting Template

If you find a bug, report it with:

```markdown
**Bug Title:** Brief description

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
What should happen

**Actual Result:**
What actually happened

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Backend URL: http://localhost:5000
- Frontend URL: http://localhost:5173

**Screenshots:**
[Attach if relevant]

**Console Errors:**
[Paste any errors from browser console]
```

---

## Testing Checklist Summary

- [ ] All 4 roles can login
- [ ] Navigation changes based on role
- [ ] Dashboard stats are accurate
- [ ] Customer CRUD works
- [ ] Follow-up notes work
- [ ] Product CRUD works
- [ ] Stock adjustment works
- [ ] Insufficient stock errors are clear
- [ ] Challan creation (draft) works
- [ ] Challan creation (confirm) works
- [ ] Challan confirmation works
- [ ] Challan cancellation works
- [ ] Stock restores on cancel
- [ ] All forms validate correctly
- [ ] All lists paginate correctly
- [ ] All searches work
- [ ] All filters work
- [ ] Loading states appear
- [ ] Empty states appear
- [ ] Error messages are helpful
- [ ] Toasts appear for all actions
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] Logout works

**Total Tests:** 100+  
**Estimated Testing Time:** 90-120 minutes

---

Generated: 2026-07-22
