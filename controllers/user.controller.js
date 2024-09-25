import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register new user

export const registerUser = async (req, res) => {
     try {
          const { fullname, email, phoneNumber, password, role } = req.body;

          if (!fullname || !email || !phoneNumber || !password || !role) {
               return res.status(400).json({
                    message: "Something is missing!",
                    success: false,
               });
          };

          const user = await User.findOne({ email });
          if (user) {
               return res.status(400).json({
                    message: "User already exists with this email!",
                    success: false,
               });
          };

          const hashedPassword = await bcrypt.hash(password, 10);

          await User.create({
               fullname,
               email,
               phoneNumber,
               password: hashedPassword,
               role,
          });

          return res.status(201).json({
               message: "Account created successfully!",
               success: true
          });

     } catch (error) {
          console.log(error);
     }
};

// login user

export const loginUser = async (req, res) => {
     try {

          // checking if all fields are filled or not

          const { email, password, role } = req.body;
          if (!email || !password || !role) {
               return res.status(400).json({
                    message: "Something is missing!",
                    success: false
               });
          };

          // checking if email is available there in database or not

          let user = await User.findOne({ email });
          if (!user) {
               return res.status(400).json({
                    message: "Incorrect Email!",
                    success: false,
               })
          };

          // checking if password entered is matching or not

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
               return res.status(400).json({
                    message: "Incorrect Password!",
                    success: false,
               });
          };

          // checking if user role entered is correct or not

          if (role !== user.role) {
               return res.status(400).json({
                    message: "Account doesn't exist with the current role, try selecting different role!",
                    success: false
               });
          };

          // generate token

          const tokenData = {
               userId: user._id
          };

          const token = await jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET_KEY, {
               expiresIn: '1d'
          });

          user = {
               _id: user._id,
               fullname: user.fullname,
               email: user.email,
               phoneNumber: user.phoneNumber,
               role: user.role,
               profile: user.profile
          }

          return res.status(200).cookie("token", token, {
               maxAge: 1 * 24 * 60 * 60 * 1000,
               httpOnly: true,
               sameSite: "strict"
          }).json({
               message: `Welcome back ${user.fullname}`,
               user,
               success: true
          });

     } catch (error) {
          console.log(error);
     };
};

// logout user

export const logoutUser = async (req, res) => {
     try {
          return res.status(200).cookie("token", "", { maxAge: 0 }).json({
               message: "User logged out successfully!",
               success: true
          });
     } catch (error) {
          console.log(error)
     };
};