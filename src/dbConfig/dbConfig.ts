import mongoose from "mongoose";

export async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);

    mongoose.connection.on("connected", () => {
      console.log("Database is connected successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.error("Error connecting to the DB: ", error);
    });
  } catch (error) {
    console.log("Something went wrong: ", error);
  }
}

