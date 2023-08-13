import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

//@description     Register new user
//@route           POST /api/user/
//@access          Public
export const register = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(403);
      throw new Error("Please Enter all fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(403);
      throw new Error("User alredy exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    }
  } catch (err) {
    next(err.message);
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
export const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    next(err.message);
  }
});

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
export const getAllUser = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};

    const users = await User.find(keyword);

    res.send(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
