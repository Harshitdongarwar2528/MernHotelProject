import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Stripe from "stripe";

// function to check availability of room
const checkAvailability = async (checkInDate, checkOutDate, room) => {
  try {
    console.log("🔍 Checking availability for room:", room);
    console.log("➡️ checkIn:", checkInDate, " checkOut:", checkOutDate);

    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: new Date(checkOutDate) },
      checkOutDate: { $gte: new Date(checkInDate) },
    });

    const isAvailable = bookings.length === 0;
    console.log("📌 isAvailable =>", isAvailable);

    return isAvailable;
  } catch (error) {
    console.error("❌ Availability Error:", error.message);
  }
};

//api to check room availability
export const checkAvailabilityApi = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    console.log("➡️ Body:", req.body);

    const isAvailable = await checkAvailability(
      checkInDate,
      checkOutDate,
      room,
    );

    return res.json({ success: true, isAvailable });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//api to create a new booking
export const createBooking = async (req, res) => {
  console.log("➡️ req.body:", req.body);
  console.log("➡️ req.user:", req.user);

  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user?._id;

    if (!user) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    //Before booking check if room is available
    const isAvailable = await checkAvailability(
      checkInDate,
      checkOutDate,
      room,
    );

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Room is not available for the selected dates",
      });
    }

    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    //Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const totalPrice = roomData.pricePerNight * nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // SEND MAIL
    try {
      console.log("📧 Sending mail to:", req.user.email);

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: req.user.email,
        subject: "Hotel Booking Details",
        html: `
          <h2>Your Booking Details</h2>
          <p>Dear ${req.user.username},</p>
          <p>Thank you for your booking! Here are your details:</p>
          <ul>
            <li><strong>Booking ID:</strong> ${booking._id}</li>
            <li><strong>Hotel Name:</strong> ${
              roomData.hotelName || roomData.hotel.name
            }</li>
            <li><strong>Location:</strong> ${
              roomData.hotelAddress || roomData.hotel.address
            }</li>
            <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
            <li><strong>Booking Amount:</strong> ${
              process.env.Currency || "$"
            } ${booking.totalPrice} /night</li>
          </ul>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("📨 Email sent!");
    } catch (mailError) {
      console.log("⚠️ Mail Error (not critical):", mailError.message);
    }

    return res.json({ success: true, message: "Booking Created Successfully" });
  } catch (error) {
    console.error("❌ BOOKING ERROR:", error);
    return res.json({ success: false, message: error.message });
  }
};

//api to get all bookings of a user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    return res.json({ success: false, message: "failed to fetch bookings" });
  }
};

//api to get hotel bookings
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth().userId });
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel Found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0,
    );

    return res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    return res.json({ success: false, message: "failed to fetch bookings" });
  }
};

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = booking.totalPrice;
    const { origin } = req.headers;

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "aud",
          product_data: {
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];
    // create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId,
      },
    });
    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, message: "Payment failed" });
  }
};
