import express from "express";
import { loginUser, logoutUser, registerUser, updateUserProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/profile/update").put(isAuthenticated, updateUserProfile);

export default router;