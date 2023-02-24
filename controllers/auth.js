import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER*/
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: 0,
      impressions: 0,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* LOGIN USER */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    !user && res.status(400).json({ msg: "User not found" });

    const validated = await bcrypt.compare(password, user.password);
    !validated && res.status(400).json({ msg: "Wrong password" });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ user, accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
