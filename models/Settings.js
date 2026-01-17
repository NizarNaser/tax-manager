import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  companyName: String,
  bundesland: String,
  vatRate: Number,
  corporateTaxRate: Number,
});

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
