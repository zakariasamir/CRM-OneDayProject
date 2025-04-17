import { connect } from "mongoose";
import { config } from "dotenv";
config();
const { MONGODB_ATLAS_URI, MONGODB_DB_NAME } = process.env;

const connectDB = async () => {
  try {
    await connect(MONGODB_ATLAS_URI);
    console.log("MongoDB connected to database");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
