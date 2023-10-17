import mongoose from "mongoose";

let isConnected = false

export const connectToDb = async() => {
    mongoose.set('strictQuery', true);
    if(!process.env.MONGODB_URL) return console.log('mongodb url is not found');
    if(isConnected) return console.log('Connected to MongoDb');
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true
    } catch (error) {
        console.log('Error:', error);
    }
}