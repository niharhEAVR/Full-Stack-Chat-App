import express from "express"; // we can do this because in the package.json the type : "module"
import authRoutes from "./routes/auth.route.js" // we need to specify the .js extension because these are the local files
import messageRoutes from "./routes/message.route.js" // we need to specify the .js extension because these are the local files
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

import path from "path";

dotenv.config();
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(PORT, () => {
    console.log(`Surver active: http://localhost:${PORT}`);
    connectDB();
})