import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Check if user already registered a hotel
    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res.json({
        success: true, // ✅ IMPORTANT
        message: "User already registered a hotel",
      });
    }

    await Hotel.create({ name, address, contact, city, owner });

    // Update user role
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    // ✅ SUCCESS RESPONSE (FIXED)
    return res.json({
      success: true,
      message: "Hotel registered successfully",
    });

  } catch (error) {
    return res.json({
      success: false, // ✅ FIXED
      message: error.message,
    });
  }
};
