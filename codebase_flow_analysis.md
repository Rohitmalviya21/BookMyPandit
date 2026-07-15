# BookMyPandit - Full Codebase Flow & Gap Analysis Documentation

This document provides a comprehensive analysis of the Frontend and Backend architecture, flows, methods, functions, libraries used, and unresolved tasks (gaps) for the **BookMyPandit** project.

---

## 1. System Architecture & Tech Stack

The project is built on the **MERN Stack** (MongoDB, Express, React, Node.js). Communication between the Frontend and Backend is established via REST APIs.

### Backend Technology Stack
*   **Core**: Express.js, Node.js
*   **Database ODM**: Mongoose (MongoDB)
*   **Authentication**: JSON Web Tokens (JWT), Google Auth Library
*   **Security & Optimizations**: Helmet (secure HTTP headers), Compression (Gzip compression), CORS (Cross-Origin Resource Sharing)
*   **File Uploads**: Multer
*   **Mailing (OTP)**: Nodemailer

### Frontend Technology Stack
*   **Core**: React (v19)
*   **Routing**: React Router DOM (v7)
*   **CSS Framework**: Bootstrap (v5)
*   **State Management**: React Context API (`AuthContext`)
*   **Animations**: GSAP (GreenSock Animation Platform), Framer Motion (`motion`)
*   **Icons**: React Icons (`FaEnvelope`, `FaLock`, etc.)
*   **OAuth**: `@react-oauth/google`
*   **Notifications**: React-Toastify

---

## 2. Database Schemas

The database contains 4 primary collections:

1.  **User Schema** (`backend/model/userSchema.js`):
    *   `name` (String, Required)
    *   `email` (String, Required, Unique)
    *   `contact` (String, Default: '')
    *   `password` (String, Required)
    *   `role` (String, Enum: `['user', 'pandit']`, Default: `'user'`)
    *   `image` (String, Profile image URL/filename)
    *   `otp` / `otpExpiry` / `isOtpVerified` (OTP Recovery Fields)
2.  **Pandit Schema** (`backend/model/panditSchema.js`):
    *   `userId` (ObjectId -> Ref: `'User'`, Unique index added)
    *   `specialization` (String, Required, Text Index added)
    *   `experience` (String, Required)
    *   `location` (String, Required, Text Index added)
    *   `fees` (Number, Required)
    *   `bio` (String)
    *   `image` (String, Profile Image filename)
3.  **Booking Schema** (`backend/model/bookingSchema.js`):
    *   `userId` (ObjectId -> Ref: `'User'`, Index added)
    *   `panditId` (ObjectId -> Ref: `'Pandit'`, Index added)
    *   `poojaType` (String, Required)
    *   `date` (String, Required)
    *   `address` (String, Required)
    *   `status` (String, Enum: `['pending', 'accepted', 'completed', 'cancelled']`, Default: `'pending'`)
4.  **Contact Schema** (`backend/model/contactSchema.js`):
    *   `name` (String, Required)
    *   `email` (String, Required)
    *   `subject` (String, Required)
    *   `message` (String, Required)
    *   `status` (String, Enum: `['pending', 'resolved']`, Default: `'pending'`)

---

## 3. USER (YAJMAN) FLOW & METHODOLOGY

The User (Yajman) flow is designed for customers who wish to book Poojas and monitor their scheduled rituals.

### A. Authentication & Onboarding
1.  **Sign Up (Registration)**:
    *   **Frontend**: User submits the form at `pages/auth/Register.jsx`.
    *   **Backend**: `POST /api/auth/register` -> Calls the `register` controller. The password is encrypted using `bcrypt` with 10 salt rounds and stored in the database.
2.  **Standard Login**:
    *   **Frontend**: User enters their email and password at `pages/auth/Login.jsx`.
    *   **Backend**: `POST /api/auth/login` -> Calls the `login` controller. Compares the hashed password using `bcrypt.compare` and signs a `JWT` token valid for 24 hours.
    *   **Global Context**: The `login()` method in `context/AuthContext.js` stores the token, role, and username in both the React state and `localStorage` for session persistence.
3.  **Google Login**:
    *   **Frontend**: Renders the `<GoogleLogin>` component from `@react-oauth/google`.
    *   **Backend**: `POST /api/auth/google` -> Calls the `googleLogin` controller. The `google-auth-library`'s `OAuth2Client` verifies the token. If the user is new, an account is created with `role: 'user'` and a random password. A JWT token is then generated and sent back to the frontend.
4.  **Password Recovery (Forgot Password)**:
    *   `POST /api/auth/send-otp` -> Generates a 6-digit random OTP using `crypto.randomInt`. Sends it to the user's email via `nodemailer`.
    *   `POST /api/auth/verify-otp` -> Verifies the OTP and validates it against the 15-minute expiry window, marking `isOtpVerified: true` if successful.
    *   `POST /api/auth/reset-password` -> Hashes the new password, updates it in the database, and resets `isOtpVerified` back to `false`.

### B. Search and Browse Pandits
*   **Frontend**: Search input is located in `HeroSection.jsx` rendered inside `pages/user/Home.jsx`.
*   **Optimization**: A **500ms Debounce** is implemented in `Home.jsx` to prevent sending API requests on every single keystroke.
*   **API Methods**:
    *   If search input is empty: Calls `GET /api/pandit/all` -> Runs `getAllPandit` to fetch all pandits.
    *   If search input is present: Calls `GET /api/pandit/search?search=value` -> Runs `searchPandit`. This utilizes MongoDB's `$text` index to search inside the `specialization` and `location` fields of the Pandit collection.

### C. Booking a Pandit
*   **Frontend Route**: `/booking/:id` -> Loads `pages/user/Booking.jsx`
*   **Process**: The user selects a Pooja type (e.g., *Ganesh Pooja, Havan, Griha Pravesh*), date, and venue address.
*   **Backend API**: `POST /api/booking/create` -> Calls the `createBooking` controller. The booking status defaults to `'pending'`. After a successful response, the user is navigated to `/my-bookings`.

### D. Booking History
*   **Frontend Route**: `/my-bookings` -> Loads `pages/user/MyBookings.jsx`
*   **Backend API**: `GET /api/booking/my-bookings` -> Calls the `getMyBooking` controller. Fetches the bookings for the logged-in user and populates the Pandit details using Mongoose `.populate()`.

### E. User Dashboard
*   **Frontend Route**: `/dashboard` -> Loads `pages/user/UserDashboard.jsx`
*   **Features**:
    *   `GET /api/booking/user-dashboard` -> Calls `userDashboaredstatus` to retrieve statistics (total bookings, completed bookings, and pending requests).
    *   **Interactive Visuals**: Renders SVG-based charts, including a 'Ritual Completion Rate' circular progress chart and a 'Spiritual Journey Wave' area chart showing booking trends.

### F. User Profile Management
*   **Frontend Route**: `/my-profile` -> Loads `pages/user/UserProfile.jsx`
*   **Features**: Users can update their name and phone number. Profiles are updated using `Multer` to upload profile images. The "Switch to Pandit" action redirects the user directly to the `/addPandit` registration page to set up their profile.

---

## 4. PANDIT FLOW & METHODOLOGY

The Pandit flow is designed for priests/pandits who want to register on the platform, manage booking requests, and update their expertise details.

### A. Pandit Profile Onboarding
*   **Frontend Route**: `/addPandit` -> Loads `pages/pandit/AddPandit.jsx`
*   **Inputs**: Specialization, Experience (years), Location/City, Dakshina/Fees (per Pooja), Bio, and a profile photo.
*   **Backend API**: `POST /api/pandit/add` -> Calls the `addPandit` controller.
    *   Creates a new profile in the `Pandit` collection linked with the user's ID.
    *   **Role Upgrade**: Automatically updates the user's role to `'pandit'` in the `User` collection.
    *   **JWT Upgrade**: Generates a **new JWT token** reflecting the updated role. Front-end intercepts this and updates the session storage, immediately switching the interface to Pandit Dashboard.

### B. Pandit Dashboard
*   **Frontend Route**: `/pandit-dashboard` (Index Route) -> Loads `pages/pandit/PanditDashboard.jsx`
*   **APIs**:
    *   `GET /api/booking/pandit-dashboard` -> Runs `panditDashboardStats` (Retrieves total requests, accepted, pending, and cancelled bookings).
    *   `GET /api/booking/recent-bookings` -> Runs `recentBooking` (Retrieves the 5 most recent bookings).
    *   **Dakshina & Demand Waves Chart**: Renders SVG-based interactive chart displaying earnings and booking counts.

### C. Booking Requests Management
*   **Frontend Route**: `/pandit-dashboard/requests` -> Loads `pages/pandit/PanditBookings.jsx`
*   **Backend API**:
    *   `GET /api/booking/pandit-bookings` -> Runs `getPanditBookings` (Fetches all bookings assigned to this Pandit).
    *   `PUT /api/booking/status/:id` -> Runs `updateBookingStatus`.
    *   `PUT /api/booking/complete/:id` -> Runs `completeBooking` (Sets booking status from `'accepted'` to `'completed'`).
*   **Actions**:
    *   The Pandit can click **Accept** (sets status to `'accepted'`) or **Reject** (sets status to `'cancelled'`).
    *   For accepted bookings, the Pandit can click **Mark as Completed** (sets status to `'completed'`).

### D. Update Profile
*   **Frontend Route**: `/pandit-dashboard/update-profile` -> Loads `pages/pandit/UpadteProfile.jsx`
*   **Backend API**: `PUT /api/pandit/update-profile` -> Runs the `updateProfile` controller (allows updating specialization, experience, location, fees, bio, and upload a new image via Multer).

---

## 5. REMAINING WORK & GAPS (MISSING FEATURES)

The following gaps and unimplemented requirements were identified in the codebase:

### 1. Switch Role Endpoint API is Missing in Backend (Bypassed)
*   **Issue**: In the original profile page and navigation bar, clicking "Switch to Pandit" attempted to call `PUT http://localhost:5000/api/user/switch-role` which does not exist in the backend.
*   **Status**: Bypassed in the frontend by changing `handleSwitchRole` to navigate directly to `/addPandit` using the `useNavigate` hook. The backend API is still missing.

### 2. Admin Dashboard is Unimplemented [RESOLVED]
*   **Status**: Successfully implemented. An admin account has been seeded at `admin@gmail.com`. The frontend implements [AdminDashboard.jsx](file:///d:/BookMyPandit/frontend/src/pages/admin/AdminDashboard.jsx) inside the `/admin` route which is protected by [AdminProtectedRoute.jsx](file:///d:/BookMyPandit/frontend/src/routes/AdminProtectedRoute.jsx). On the backend, all administrative endpoints in [adminRoutes.js](file:///d:/BookMyPandit/backend/routes/adminRoutes.js) are registered and secured behind both `authmiddleware` and `adminmiddlewere`.

### 3. Pooja Completion Status Flow is Missing [RESOLVED]
*   **Status**: Successfully implemented. The backend route `PUT /api/booking/complete/:id` and controller `completeBooking` transition accepted bookings to `'completed'`. The frontend request list (`PanditBookings.jsx`) shows a "Mark as Completed" button for accepted bookings. The User Dashboard counts stats by querying for status `'completed'`.

### 4. JWT Payload Mismatch in Google Login [RESOLVED]
*   **Status**: Successfully resolved. Updated the `googleLogin` controller inside [authController.js](file:///d:/BookMyPandit/backend/controllers/authController.js) to sign the JWT with payload `{ id, email: user.email, role: user.role }`, ensuring consistency with standard email logins.

### 5. Dedicated Profile Password Change [RESOLVED]
*   **Status**: Successfully implemented. Clicking "Change Password" in the user profile modal on [UserProfile.jsx](file:///d:/BookMyPandit/frontend/src/pages/user/UserProfile.jsx) opens a password update modal popup. The user inputs their current and new passwords which are verified and updated securely using the backend endpoint `PUT /api/user/change-password` without triggering the nodemailer OTP email process.

### 6. No Cancellation Option for User [RESOLVED]
*   **Status**: Successfully implemented. Users (Yajmans) can cancel their own bookings if they are in a `'pending'` status by clicking the "Cancel Booking" button in [MyBookings.jsx](file:///d:/BookMyPandit/frontend/src/pages/user/MyBookings.jsx) card footer. The backend endpoint `PUT /api/booking/cancel/:id` handles ownership checks and verifies the status before marking the booking as `'cancelled'`.

### 7. Reviews & Ratings Module [RESOLVED]
*   **Status**: Successfully implemented. Yajmans can review their completed bookings by clicking "Write a Review" in [MyBookings.jsx](file:///d:/BookMyPandit/frontend/src/pages/user/MyBookings.jsx) which launches a star-rating modal. Pandit statistics (ratings, total count) are denormalized and stored in the database via [reviewController.js](file:///d:/BookMyPandit/backend/controllers/reviewController.js). The public reviews are listed on [PanditDetails.jsx](file:///d:/BookMyPandit/frontend/src/pages/pandit/PanditDetails.jsx).
