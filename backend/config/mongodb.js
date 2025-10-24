import mongoose from "mongoose";

const connectBD = async()=>{

    mongoose.connection.on('connected', ()=> console.log("Database connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/medi-book-pro`)
     
}

export default connectBD

