import bcrypt from "bcryptjs";
import user from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;

    try {
        // Check for missing fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Password length check
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new user({
            email,
            fullName,
            password: hashPass
        });

        await newUser.save();

        // Generate and set token
        generateToken(newUser._id, res);

        // Send response
        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic || null
        });

    } catch (error) {
        console.error("Error in the signup controller ->", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        const userExists = await user.findOne({ email });
        if (!userExists) {
            return res.status(400).json({ message: "Invalid Credentials!!" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


        generateToken(userExists._id, res)

        res.status(201).json({
            _id: userExists._id,
            email: userExists.email,
            fullName: userExists.fullName,
            profilePic: userExists.profilePic || null
        });
    } catch (error) {
        console.error("Error in the login controller ->", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("Token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out" })
    } catch (error) {
        console.error("Error in the logout controller ->", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;

        const userId = req.user._id;

        if (!profilePic) {
            res.status(400).json({ message: "Profile Picture is Required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await user.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in the update controller ->", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const checkUser = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.error("Error in the checkUser controller ->", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}