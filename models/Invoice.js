import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  title: String,
  amount: Number,
  date: Date,
  description: String,
  imageUrl: String,
});

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
