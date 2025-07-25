import express from "express"; // we can do this because in the package.json the type : "module"
import authRoutes from "./routes/auth.route.js" // we need to specify the .js extension because these are the local files
import messageRoutes from "./routes/message.route.js" // we need to specify the .js extension because these are the local files
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log(`Surver active: http://localhost:${PORT}`);
    connectDB();
})