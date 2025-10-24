# Testing PayHere Payment Flow with Postman

## Overview
While you can't test the actual PayHere checkout popup in Postman, you CAN test your backend payment APIs to ensure they're working correctly.

---

## Prerequisites

1. **Backend running:** `http://localhost:4000`
2. **Database connected:** MongoDB must be accessible
3. **Valid test data:**
   - A registered user account
   - At least one unpaid appointment in the database

---

## Step 1: Get Authentication Token

### A. Using Frontend (Easiest)
1. Open your app in browser: `http://localhost:5173`
2. Login with a test user
3. Open DevTools Console (F12)
4. Run: `localStorage.getItem('token')`
5. Copy the token value

### B. Using Postman (Manual Login)

**Request:**
```
POST http://localhost:4000/api/user/login
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token** for next steps.

---

## Step 2: Get User's Appointments (Find Unpaid Appointment ID)

**Request:**
```
GET http://localhost:4000/api/user/appointments
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "token": "YOUR_TOKEN_HERE"
}
```

**Response Example:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "673c5f8a1234567890abcdef",
      "docData": {
        "name": "Dr. John Smith",
        "speciality": "Cardiologist"
      },
      "slotDate": "10_Nov_2024",
      "slotTime": "10:00 AM",
      "amount": 50,
      "payment": false,
      "cancelled": false
    }
  ]
}
```

**Copy the `_id`** of an unpaid appointment (`payment: false`).

---

## Step 3: Test Payment Generation

This endpoint creates the PayHere payment payload.

**Request:**
```
POST http://localhost:4000/api/user/generate-payment
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "token": "YOUR_TOKEN_HERE"
}
```

**Body (raw JSON):**
```json
{
  "appointmentId": "673c5f8a1234567890abcdef"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "payment": {
    "sandbox": true,
    "merchant_id": "1232543",
    "return_url": "http://localhost:5173/my-appointments",
    "cancel_url": "http://localhost:5173/my-appointments",
    "notify_url": "http://localhost:4000/api/user/verify-payment",
    "order_id": "673c5f8a1234567890abcdef",
    "items": "Appointment with Dr. John Smith",
    "amount": "50.00",
    "currency": "LKR",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "0771234567",
    "address": "123 Main St",
    "city": "Colombo",
    "country": "Sri Lanka",
    "hash": "D8B5F6E7C8A9B0C1D2E3F4A5B6C7D8E9"
  }
}
```

### What to Verify:
✅ `success: true`  
✅ `hash` is present (32-character uppercase hex string)  
✅ `amount` is formatted as "XX.XX" (2 decimal places)  
✅ `order_id` matches your `appointmentId`  
✅ User details (name, email, phone, address) are populated

### Possible Errors:

**Error: "Appointment not found"**
```json
{
  "success": false,
  "message": "Appointment not found"
}
```
➜ Use a valid appointment ID from Step 2

**Error: "Missing Details" or 401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authorized"
}
```
➜ Check your token is correct and not expired

---

## Step 4: Test Payment Verification (Simulate PayHere Callback)

This simulates what PayHere sends to your backend after a successful payment.

**Request:**
```
POST http://localhost:4000/api/user/verify-payment
```

**Headers:**
```json
{
  "Content-Type": "application/x-www-form-urlencoded"
}
```

**Body (x-www-form-urlencoded format):**

Click "Body" tab → Select "x-www-form-urlencoded" → Add these key-value pairs:

| Key | Value | Description |
|-----|-------|-------------|
| `merchant_id` | `1232543` | Your merchant ID |
| `order_id` | `673c5f8a1234567890abcdef` | Appointment ID |
| `payment_id` | `320012345` | Fake PayHere payment ID |
| `payhere_amount` | `50.00` | Payment amount |
| `payhere_currency` | `LKR` | Currency |
| `status_code` | `2` | Success = 2 |
| `md5sig` | `test_signature` | Signature (ignored in test) |
| `method` | `VISA` | Payment method |

**Expected Response:**
```
Status: 200 OK
(Empty body or success message)
```

**Backend should:**
- Update appointment `payment: true`
- Update doctor's earnings

### Status Codes Reference:
- `2` = **Success** (payment completed)
- `0` = Pending
- `-1` = Canceled
- `-2` = Failed
- `-3` = Chargedback

---

## Step 5: Verify Payment Status Updated

Re-check the appointment to confirm payment was marked as paid.

**Request:**
```
GET http://localhost:4000/api/user/appointments
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "token": "YOUR_TOKEN_HERE"
}
```

**Expected Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "673c5f8a1234567890abcdef",
      "payment": true,    ← Should now be true
      "cancelled": false
    }
  ]
}
```

---

## Testing Complete Payment Flow End-to-End

### Option A: Using Browser (Real PayHere Sandbox)

1. **Start backend:** `npm run server`
2. **Start frontend:** `npm run dev`
3. **Fix MongoDB connection** (currently failing in your logs)
4. **Open browser:** `http://localhost:5173`
5. Login → My Appointments
6. Click "Pay Online"
7. Use PayHere sandbox test card:
   - **Card:** 4916217501611292
   - **Expiry:** 12/25
   - **CVV:** 123
   - **Name:** Test User

### Option B: Using Ngrok + Postman (Test Callbacks)

If you want to test PayHere's callback to your localhost:

1. **Install ngrok:** https://ngrok.com/download
2. **Expose backend:**
   ```bash
   ngrok http 4000
   ```
3. **Copy the public URL** (e.g., `https://abc123.ngrok.io`)
4. **Update `.env`:**
   ```env
   PAYHERE_NOTIFY_URL=https://abc123.ngrok.io/api/user/verify-payment
   ```
5. **Restart backend**
6. **Test in browser** - PayHere will now callback to your public URL

---

## Postman Collection Export

Here's a ready-to-import Postman collection:

```json
{
  "info": {
    "name": "PayHere Payment Testing",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. User Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"yourpassword\"\n}"
        },
        "url": {
          "raw": "http://localhost:4000/api/user/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "user", "login"]
        }
      }
    },
    {
      "name": "2. Get Appointments",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "token",
            "value": "{{token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:4000/api/user/appointments",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "user", "appointments"]
        }
      }
    },
    {
      "name": "3. Generate Payment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "token",
            "value": "{{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"appointmentId\": \"{{appointmentId}}\"\n}"
        },
        "url": {
          "raw": "http://localhost:4000/api/user/generate-payment",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "user", "generate-payment"]
        }
      }
    },
    {
      "name": "4. Verify Payment (Simulate PayHere)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/x-www-form-urlencoded"
          }
        ],
        "body": {
          "mode": "urlencoded",
          "urlencoded": [
            {
              "key": "merchant_id",
              "value": "1232543"
            },
            {
              "key": "order_id",
              "value": "{{appointmentId}}"
            },
            {
              "key": "payment_id",
              "value": "320012345"
            },
            {
              "key": "payhere_amount",
              "value": "50.00"
            },
            {
              "key": "payhere_currency",
              "value": "LKR"
            },
            {
              "key": "status_code",
              "value": "2"
            },
            {
              "key": "md5sig",
              "value": "test_signature"
            },
            {
              "key": "method",
              "value": "VISA"
            }
          ]
        },
        "url": {
          "raw": "http://localhost:4000/api/user/verify-payment",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "user", "verify-payment"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "token",
      "value": "your-jwt-token-here"
    },
    {
      "key": "appointmentId",
      "value": "appointment-id-here"
    }
  ]
}
```

**To import:**
1. Open Postman
2. Click "Import" → "Raw text"
3. Paste the JSON above
4. Click "Import"
5. Update variables: `token` and `appointmentId`

---

## Important Notes

### ⚠️ Current Issues in Your Logs

Your backend is having MongoDB connection issues:
```
Failed to connect to MongoDB: querySrv ENOTFOUND _mongodb._tcp.cluster0.pxu1im2.mongodb.net
```

**Fix this first:**
1. Check your internet connection
2. Verify MongoDB Atlas cluster is running
3. Check `.env` file has correct `MONGODB_URI`
4. Whitelist your IP in MongoDB Atlas (Network Access)

### 🔐 Authentication

- All user endpoints require the `token` header
- Token is a JWT generated on login
- Token expires based on your JWT_SECRET config
- If you get 401 errors, re-login to get a fresh token

### 🧪 Test vs Production

- Current setup uses PayHere **Sandbox**
- Sandbox test cards will NOT charge real money
- For production, change:
  - Script: `https://www.payhere.lk/lib/payhere.js`
  - Credentials: Use production merchant ID and secret
  - Payment object: `sandbox: false`

---

## Troubleshooting

### "Appointment not found"
➜ Verify the appointment ID exists and belongs to the logged-in user

### "Invalid hash" (when testing real payments)
➜ Check `PAYHERE_MERCHANT_SECRET` is correct in `.env`

### Verify endpoint returns 500
➜ Check MongoDB connection is working

### Payment not updating in database
➜ Check backend logs for the POST to `/verify-payment`
➜ Ensure `status_code` is `2` (success)

---

## Summary

✅ **Can test in Postman:**
- Payment generation endpoint
- Payment verification endpoint (simulate callback)
- Authentication endpoints
- Appointment listing

❌ **Cannot test in Postman:**
- Actual PayHere checkout popup
- Browser redirects
- PayHere's real payment processing

🎯 **Best approach:**
- Use Postman for backend API testing
- Use browser + PayHere sandbox for full payment flow testing
- Use ngrok to test live callbacks during development
