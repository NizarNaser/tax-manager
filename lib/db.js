import sequelize from "./sequelize";

let cached = global.dbConnectState;
if (!cached) cached = global.dbConnectState = { promise: null, ready: false };

async function dbConnect() {
  if (cached.ready) return sequelize;
  if (!cached.promise) {
    console.log("Connecting to MySQL...");
    cached.promise = sequelize
      .authenticate()
      .then(() => sequelize.sync())
      .then(() => {
        console.log("MySQL Connected Successfully");
        cached.ready = true;
        return sequelize;
      })
      .catch((err) => {
        console.error("MySQL Connection Error:", err);
        cached.promise = null;
        throw err;
      });
  }
  return cached.promise;
}

export default dbConnect;
