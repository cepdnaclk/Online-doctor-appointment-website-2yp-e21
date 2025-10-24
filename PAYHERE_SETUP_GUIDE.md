# PayHere Integration Setup Guide

## What Was Fixed

### Problem
You were getting `ReferenceError: payhere is not defined` because:
1. The code was using `payhere` directly instead of `window.payhere`
2. The PayHere SDK is loaded as a global script in the browser window

### Solution Applied
Changed all references from `payhere` to `window.payhere` in `MyAppointments.jsx`:
- `window.payhere.onCompleted`
- `window.payhere.onDismissed`
- `window.payhere.onError`
- `window.payhere.startPayment()`

Also added a safety check at the start of `handlePayment()` to verify the SDK is loaded.

## Files Modified

1. **frontend/index.html**
   - Changed PayHere script to sandbox version:
   ```html
   <script type="text/javascript" src="https://sandbox.payhere.lk/lib/payhere.js"></script>
   ```

2. **frontend/src/pages/MyAppointments.jsx**
   - All `payhere` references changed to `window.payhere`
   - Added SDK availability check before payment initialization

3. **backend/controllers/userController.js**
   - Fixed PayHere hash generation (MD5 instead of HMAC)
   - Corrected amount formatting to 2 decimal places
   - Added `PAYHERE_NOTIFY_URL` support for custom callback URLs

## Configuration Required

### 1. PayHere Sandbox Settings
Log in to your PayHere Sandbox Merchant Portal and:
- Add `http://localhost:5173` to **Allowed Domains**
- Add any other frontend URLs you'll use for testing

### 2. Backend Environment Variables (`.env`)
Your current settings:
```env
PAYHERE_MERCHANT_ID="1232543"
PAYHERE_MERCHANT_SECRET="MTI4NjU4MjY4NDEzMTY4NTY4MTUyMjkwNjgyMzY0MjA4Nzc2Njg4"
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
```

### 3. Making Notify URL Public (Important!)
PayHere needs to send payment confirmation to your backend. Since `localhost:4000` isn't accessible from the internet, you need to expose it:

**Option A: Using ngrok (Recommended for Development)**
```powershell
# Install ngrok from https://ngrok.com/
# Then run:
ngrok http 4000
```

This will give you a public URL like: `https://abc123.ngrok.io`

Add to your `.env`:
```env
PAYHERE_NOTIFY_URL=https://abc123.ngrok.io/api/user/verify-payment
```

**Option B: Using Cloudflare Tunnel**
```powershell
# Install cloudflared
# Run:
cloudflared tunnel --url http://localhost:4000
```

**Option C: For Production**
Use your actual production backend URL:
```env
PAYHERE_NOTIFY_URL=https://yourdomain.com/api/user/verify-payment
```

## Testing Steps

### 1. Restart Everything
```powershell
# Stop any running servers (Ctrl+C)

# Start Backend
cd "D:\Web development course\Full project\hospital-doctor-appointment-website-\backend"
npm run server

# Start Frontend (in new terminal)
cd "D:\Web development course\Full project\hospital-doctor-appointment-website-\frontend"
npm run dev
```

### 2. Full Browser Refresh
- Open `http://localhost:5173`
- Press `Ctrl+Shift+R` (hard refresh) to ensure new `index.html` loads
- Open DevTools Console (F12)
- Type `window.payhere` and press Enter
  - ✅ Should show an object `{startPayment: ƒ, ...}`
  - ❌ If undefined, refresh again

### 3. Test Payment Flow
1. Log in to your app
2. Go to "My Appointments"
3. Click "Pay Online" on an unpaid appointment
4. PayHere popup/redirect should open (no CORS error)
5. Use PayHere sandbox test cards to complete payment
6. After payment:
   - Check console for "Payment completed" message
   - Appointment should show "Paid" status
   - Backend should receive notify callback (check terminal logs)

## Sandbox Test Card Details
Use these in PayHere sandbox:
- **Card Number:** 4916217501611292
- **Expiry:** Any future date (e.g., 12/25)
- **CVV:** 123
- **Name:** Any name

## Troubleshooting

### Issue: "PayHere SDK is not loaded yet"
**Solution:** 
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for script loading errors
- Verify internet connection

### Issue: Payment completes but appointment stays unpaid
**Causes:**
- `PAYHERE_NOTIFY_URL` is not set or not reachable
- Backend isn't running
- Firewall blocking ngrok/tunnel

**Solution:**
- Check backend terminal for incoming POST to `/api/user/verify-payment`
- Verify ngrok/tunnel is running and URL is correct in `.env`
- Check PayHere sandbox logs for webhook delivery status

### Issue: CORS error on payment
**Solution:**
- Verify `http://localhost:5173` is in PayHere Sandbox Allowed Domains
- Ensure using sandbox script (not production) in `index.html`

### Issue: "Invalid hash" or payment rejected
**Solution:**
- Verify `PAYHERE_MERCHANT_SECRET` is correct
- Backend code now uses correct MD5 hash format
- Amount must have exactly 2 decimal places (already fixed)

## Why window.payhere?

The other AI model was **100% correct**! Here's why:

- PayHere loads as a **global script** that attaches to the browser's `window` object
- In React/modern JS, accessing globals without `window.` can cause ReferenceError
- Using `window.payhere` explicitly:
  - ✅ Prevents ReferenceError
  - ✅ Makes code more explicit and safer
  - ✅ Allows runtime checking (`if (!window.payhere)`)

## Payment Flow Diagram

```
User clicks "Pay Online"
    ↓
Frontend: MyAppointments.jsx
    ↓
POST /api/user/generate-payment → Backend generates payment hash
    ↓
Frontend receives payment data
    ↓
window.payhere.startPayment() → Opens PayHere checkout
    ↓
User completes payment on PayHere
    ↓
PayHere sends callback → POST to PAYHERE_NOTIFY_URL
    ↓
Backend: verifyPayment() → Updates appointment.payment = true
    ↓
Frontend: onCompleted callback → Refreshes appointments list
    ↓
User sees "Paid" status ✓
```

## Security Notes

1. **Never expose secrets:** Keep `.env` out of git (already in `.gitignore`)
2. **Sandbox vs Production:**
   - Currently using sandbox credentials
   - Before going live, replace with production keys
   - Change script to `https://www.payhere.lk/lib/payhere.js`
   - Set `sandbox: false` in payment object
3. **Verify callbacks:** The `verifyPayment` endpoint checks `status_code == 2` before updating

## Support

If you still face issues:
1. Check browser console for errors
2. Check backend terminal for API logs
3. Review PayHere sandbox dashboard for transaction logs
4. Verify all environment variables are set correctly

---

**Summary:** The issue was simple - using `payhere` instead of `window.payhere`. The other AI model was absolutely right! 🎯
