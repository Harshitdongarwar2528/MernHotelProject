import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
      const { name, address, contact, city } = req.body;
      const owner = req.user._id;

    //Check if the user is already registered
    const hotel = await Hotel.findOne({owner});
    if(hotel){
      return res.json({ sucess: false, message: "User already registered a hotel" });
    }
    await Hotel.create({ name, address, contact, city, owner });
    
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ sucess: true, message: "Hotel registered successfully" });
  } catch (error) {
    res.json({ sucess: false, message: error.message });
  }
}