import jwt from "jsonwebtoken";
import user from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.Token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" })
        }
        const userExists = await user.findById(decoded.userId).select("-password"); // select("-password") => this means exclude password, and give other things
        // console.log(userExists);
        

        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = userExists;
        next();
    } catch (error) {
        console.log("Error in ProtectRoute middleware", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}