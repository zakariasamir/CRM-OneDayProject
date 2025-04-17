import { Schema, model } from "mongoose";

const leadSchema = new Schema({
  contactName: String,
  contactEmail: String,
  companyName: String,
  status: {
    type: String,
    enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"],
    default: "PENDING",
  },
  managerId: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Lead", leadSchema);
