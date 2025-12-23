# 🏨 Roomify - Hotel Booking Platform

**Roomify** is a full-stack hotel booking platform built with the MERN stack that allows users to discover and book hotel rooms, while enabling hotel owners to publish and manage their properties through a dedicated dashboard.

The project focuses on **real-world authentication, payments, and deployment practices**.

---

## ✨ Features

### 👤 **Authentication & Roles**
- Secure authentication using **Clerk**
- **Role-based access**:
  - **Customer**
  - **Hotel Owner**
  - **Admin**

### 🏨 **Hotel Management (Owner)**
- Publish hotels
- Add and manage rooms
- Upload room images (**Cloudinary**)
- View bookings for owned hotels

### 🔍 **Booking Experience (User)**
- Search hotels by city
- Check room availability by date
- Book rooms with guest count
- View booking status

### 💳 **Payments**
- **Stripe Checkout** integration
- Secure payment confirmation using **Stripe Webhooks**
- Supports:
  - Online payment (Stripe)
  - Pay at Hotel option
- **Payment status is always verified on the backend using webhooks** (not frontend redirects)

### 📧 **Notifications**
- Booking confirmation emails using **Nodemailer**
- Email sent after successful booking/payment

---

## 🛠 Tech Stack

### **Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Context API
- **Deployed on Vercel**

### **Backend**
- Node.js
- Express.js
- MongoDB & Mongoose
- Clerk (Authentication & Roles)
- Stripe (Payments & Webhooks)
- Cloudinary (Image Storage)
- Nodemailer (Emails)
- **Deployed on Vercel**

### **Database**
- MongoDB Atlas

---

## 🔐 Authentication Flow
1. User signs in using **Clerk**
2. Clerk middleware protects backend routes
3. Role information is used to control access (user / owner / admin)

## 💳 Payment Flow (Stripe)
1. Booking is created with `isPaid = false`
2. Stripe Checkout session is created
3. User completes payment
4. Stripe webhook (`checkout.session.completed`) is triggered
5. Backend verifies webhook signature
6. Booking is updated to `isPaid = true`

---

## ⚙️ Environment Variables

Create a `.env` file in the backend and a `.env` file in the frontend.

### 🔒 **Backend `.env`**
```env
MONGODB_URI=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SENDER_EMAIL=
SMTP_USER=
SMTP_PASS=
```

### 🌐 **Frontend `.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_BACKEND_URL=
VITE_CURRENCY=
```

> **⚠️ Never commit `.env` files to GitHub**

---

## 🚀 Deployment
- **Frontend**: Vercel
- **Backend**: Vercel
- **Database**: MongoDB Atlas
- **Stripe webhooks**:
  - Stripe CLI for local development
  - Stripe Dashboard Webhooks for production

---

## 📌 Project Type
Junior-level, production-style learning project

This project was built to gain hands-on experience with:
- **Secure authentication**
- **Payment systems with webhooks**
- **Backend-driven state management**
- **Cloud deployment and environment handling**

---

## 🧠 Future Improvements
- Admin analytics dashboard
- Booking cancellation & refunds
- Reviews and ratings
- Advanced search filters
- Improved error monitoring

---

## 🎥 Video Demos
<details>
<summary><strong>📁 Click to view LinkedIn video posts</strong></summary>

### 🔗 **LinkedIn Video Links:**
1. **Project Overview**: [LinkedIn Post](https://www.linkedin.com/posts/yourusername_roomify-demo-activity-123456)
2. **Authentication Demo**: [LinkedIn Post](https://www.linkedin.com/posts/yourusername_authentication-demo-activity-123457)
3. **Booking Flow**: [LinkedIn Post](https://www.linkedin.com/posts/yourusername_booking-flow-activity-123458)
4. **Owner Dashboard**: [LinkedIn Post](https://www.linkedin.com/posts/yourusername_owner-dashboard-activity-123459)
5. **Payment Integration**: [LinkedIn Post](https://www.linkedin.com/posts/yourusername_stripe-payments-activity-123460)

</details>

---

## 📁 Project Structure
```
roomify/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   ├── package.json
│   └── server.js
├── video/
│   └── README.md          # Links to LinkedIn video posts
├── .gitignore
├── README.md
└── package.json
```

---

## 👤 Author
**Harshit**  
Full-Stack Developer (MERN)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/yourusername) 
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/yourusername)

---

## ⭐ Show Your Support
If you find this project helpful, please give it a ⭐ on GitHub!

---

<div align="center">
  
**Made with ❤️ using the MERN Stack**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

</div>