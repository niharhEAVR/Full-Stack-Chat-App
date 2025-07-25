import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("Token", token, {
        maxAge: 7 * 24 * 60 * 1000, // milliseconds
        httpOnly: true, // prevent XSS attackts cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        // secure: process.env.NODE_ENV !== "development"
        secure: process.env.NODE_ENV === "production"
    })

    return token;
}

// secure would determine is this is https or http
// since we are on localhost for building this project so we will make it false
// but in production mode we have to made it true