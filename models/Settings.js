import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";

const Settings = sequelize.define("Settings", {
  userId: { type: DataTypes.STRING, allowNull: false, unique: true },
  companyName: DataTypes.STRING,
  bundesland: DataTypes.STRING,
  vatRate: DataTypes.FLOAT,
  corporateTaxRate: DataTypes.FLOAT,
  companyLogo: DataTypes.STRING(500),
  taxId: DataTypes.STRING,
  vatId: DataTypes.STRING,
  address: DataTypes.STRING,
  country: DataTypes.STRING,
  currency: { type: DataTypes.STRING, defaultValue: "EUR" },
});

export default Settings;
