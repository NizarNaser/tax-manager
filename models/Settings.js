import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  companyName: String,
  bundesland: String,
  vatRate: Number,
  corporateTaxRate: Number,
  companyLogo: String,
  taxId: String,
  vatId: String,
  address: String,
  country: String,
  currency: { type: String, default: "EUR" },
});

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
