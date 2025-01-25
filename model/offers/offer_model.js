import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  fileUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Offer", OfferSchema);
