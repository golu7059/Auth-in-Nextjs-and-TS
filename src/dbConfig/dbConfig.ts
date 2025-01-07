import mongoose from "mongoose";

export async function dbConnection() {
    try {
        console.log("Going to connect the database")
        const connection = await mongoose.connect(process.env.MONGO_URL!);

        connection.connection.on('connected' , ()=> {
            console.log("Database is connected successfully ")
        })

        connection.connection.on('error', (error) => {
            console.error("Error connecting to the DB: ", error);
        });
    } catch (error) {
        console.log("Something went wrong: ", error);
    }
}

