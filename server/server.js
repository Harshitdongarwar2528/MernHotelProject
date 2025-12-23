import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebHooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoute.js';
import bookingRouter from './routes/bookingRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhookss.js';

connectDB();
connectCloudinary();

const app = express();
app.use(cors());
//API to listen stripe webhooks
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
app.use(express.json());


// ⭐ MUST BE ABOVE clerkMiddleware — so it works without auth
app.get("/api/health", (req, res) => {
  console.log("💓 HEALTH CHECK HIT");
  res.json({ success: true, message: "Server awake" });
});

// Clerk Middleware
app.use(clerkMiddleware());

// Clerk webhook
app.post('/api/clerk', clerkWebhooks);

app.get('/', (req, res) => res.send('API is Working !'));

app.use('/api/users', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
