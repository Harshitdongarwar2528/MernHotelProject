🏨 Roomify

Roomify is a full-stack hotel booking platform built with the MERN stack that allows users to discover and book hotel rooms, while enabling hotel owners to publish and manage their properties through a dedicated dashboard.

The project focuses on real-world authentication, payments, and deployment practices.

✨ Features
👤 Authentication & Roles

Secure authentication using Clerk

Role-based access:

Customer

Hotel Owner

Admin

🏨 Hotel Management (Owner)

Publish hotels

Add and manage rooms

Upload room images (Cloudinary)

View bookings for owned hotels

🔍 Booking Experience (User)

Search hotels by city

Check room availability by date

Book rooms with guest count

View booking status

💳 Payments

Stripe Checkout integration

Secure payment confirmation using Stripe Webhooks

Supports:

Online payment (Stripe)

Pay at Hotel option

Payment status is always verified on the backend using webhooks (not frontend redirects).

📧 Notifications

Booking confirmation emails using Nodemailer

Email sent after successful booking/payment

🛠 Tech Stack
Frontend

React (Vite)

Tailwind CSS

React Router

Context API

Deployed on Vercel

Backend

Node.js

Express.js

MongoDB & Mongoose

Clerk (Authentication & Roles)

Stripe (Payments & Webhooks)

Cloudinary (Image Storage)

Nodemailer (Emails)

Deployed on Vercel

Database

MongoDB Atlas

🔐 Authentication Flow

User signs in using Clerk

Clerk middleware protects backend routes

Role information is used to control access (user / owner / admin)

💳 Payment Flow (Stripe)

Booking is created with isPaid = false

Stripe Checkout session is created

User completes payment

Stripe webhook (checkout.session.completed) is triggered

Backend verifies webhook signature

Booking is updated to isPaid = true

⚙️ Environment Variables

Create a .env file in the backend and a .env file in the frontend.

🔒 Backend .env
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

🌐 Frontend .env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_BACKEND_URL=
VITE_CURRENCY=


⚠️ Never commit .env files to GitHub

🚀 Deployment

Frontend: Vercel

Backend: Vercel

Database: MongoDB Atlas

Stripe webhooks:

Stripe CLI for local development

Stripe Dashboard Webhooks for production

📌 Project Type

Junior-level, production-style learning project

This project was built to gain hands-on experience with:

Secure authentication

Payment systems with webhooks

Backend-driven state management

Cloud deployment and environment handling

🧠 Future Improvements

Admin analytics dashboard

Booking cancellation & refunds

Reviews and ratings

Advanced search filters

Improved error monitoring

👤 Author

Harshit
Full-Stack Developer (MERN)