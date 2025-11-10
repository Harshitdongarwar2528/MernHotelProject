import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { userData, storeRecentSearchCities } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/', protect, userData);
userRouter.post('/store-recent-search', protect, storeRecentSearchCities);


export default userRouter;