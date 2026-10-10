import { Sequelize } from "sequelize";

const DB_NAME = (process.env.DB_NAME || "").trim();
const DB_USER = (process.env.DB_USER || "").trim();
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = (process.env.DB_HOST || "127.0.0.1").trim();
const DB_PORT = Number(process.env.DB_PORT) || 3306;

if (!DB_NAME || !DB_USER) {
  throw new Error("DB_NAME and DB_USER must be defined (check your .env)");
}

let sequelize = global.sequelizeInstance;
if (!sequelize) {
  sequelize = global.sequelizeInstance = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
  });
}

export default sequelize;
