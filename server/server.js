import express, { json, urlencoded } from "express";
import { config } from "dotenv";
const app = express();
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routes/auth.routes.js";
import employerRouter from "./src/routes/employer.routes.js";
import managerRouter from "./src/routes/manager.routes.js";
config();
app.use(json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
connectDB();

app.use(urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/employer", employerRouter);
app.use("/api/manager", managerRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
