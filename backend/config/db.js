import mongoose from "mongoose";

const ConnectDb = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI)
      console.log(`database berhasil connect : ${conn.connection.host}`)
    } catch (error) {
      console.log('error :', error)
    }
};

export default ConnectDb;