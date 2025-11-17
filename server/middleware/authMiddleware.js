import User from "../models/User.js";
import { getAuth, clerkClient } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not logged in"
      });
    }

    // Try to find user in DB
    let user = await User.findById(userId);

    // If user does NOT exist, create it
    if (!user) {
      // Fetch full user info from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);

      user = await User.create({
        _id: userId,
        username: clerkUser.username || clerkUser.firstName || "User",
        email: clerkUser.emailAddresses[0].emailAddress,
        image: clerkUser.imageUrl,
        role: "user",
        recentSearchedCities: []
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed: " + error.message
    });
  }
};
