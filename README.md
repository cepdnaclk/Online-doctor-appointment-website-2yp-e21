# Doctor Appointment Web App – Full Setup Guide

## Overview

This is a full-stack doctor appointment booking system with:
- **Backend**: Node.js, Express, MongoDB, JWT, Cloudinary, Multer
- **Frontend**: React (Vite), Tailwind, React Router, Axios, Toastify
- **Admin Panel**: React (Vite), separate SPA for admin management

---

## Folder Structure

```
hospital-doctor-appointment-website-/
│
├── backend/      # Node.js/Express API server
├── frontend/     # Main React client for users
├── admin/        # React admin panel
```

---

## Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

---

## 1. Backend Setup

### Install dependencies

```sh
cd backend
npm install
```

### Environment variables

Edit `.env` in `backend/`:

```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
ClOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
ADMIN_EMAIL=admin@medibook.com
ADMIN_PASSWORD=admin@123
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
```

### Start backend server

```sh
npm run server
```
- Runs on `http://localhost:4000`

---

## 2. Frontend Setup

### Install dependencies

```sh
cd frontend
npm install
```

### Environment variables

Edit `.env` in `frontend/`:

```
VITE_BACKEND_URL=http://localhost:4000
```

### Start frontend dev server

```sh
npm run dev
```
- Runs on `http://localhost:5173`

---

## 3. Admin Panel Setup

### Install dependencies

```sh
cd admin
npm install
```

### Environment variables

Edit `.env` in `admin/`:

```
VITE_BACKEND_URL=http://localhost:4000
```

### Start admin dev server

```sh
npm run dev
```
- Runs on `http://localhost:5174`

---

## 4. Database & Cloudinary

- Make sure your MongoDB URI is correct and accessible.
- Create a Cloudinary account and set your credentials in `.env`.

---

## 5. Running Locally

1. Start backend (`npm run server` in `backend/`)
2. Start frontend (`npm run dev` in `frontend/`)
3. Start admin (`npm run dev` in `admin/`)
4. Access:
	- User site: `http://localhost:5173`
	- Admin panel: `http://localhost:5174`

---

## 6. Deployment

- **Backend**: Deploy to [Render](https://render.com/) or [Railway](https://railway.app/) // only having the trail of 30 days
- **Frontend/Admin**: Deploy to [Netlify](https://netlify.com/) or [Vercel](https://vercel.com/)
- Set environment variables in your hosting dashboard.

---

## 7. API Endpoints

- `/api/user/*` – User actions (register, login, appointments, payment)
- `/api/doctor/*` – Doctor actions (profile, appointments)
- `/api/admin/*` – Admin actions (manage doctors, appointments)

---

## 8. Performance & Security Testing

- See `backend/k6-tests/` for load and stress test scripts (using [k6](https://k6.io/)).
- Use Postman for manual API testing.

---

## 9. Team Members

**Group M : Members**
1. MADHUSHAN S.K.A.K. – E/21/245 (Team Leader)
2. DARSHANA K.M.S.  – E/21/077
3. FONSEKA H.F.S.R. - E/21/140
4. ARNIKAN U.  - E/21/036

---

If you have any issues, check your `.env` files, MongoDB/Cloudinary credentials, and make sure all servers are running. Good luck!
