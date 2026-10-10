import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";

const Invoice = sequelize.define("Invoice", {
  userId: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM("income", "expense"), allowNull: false },
  title: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  date: DataTypes.DATE,
  description: DataTypes.TEXT,
  imageUrl: DataTypes.STRING(500),
});

export default Invoice;
