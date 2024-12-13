import mongoose from "mongoose";

const connectMongo = async (url: string): Promise<void> => {
  try {
    const connection = await mongoose.connect(url);
  } catch (error: any) {
    console.log("🚀 ~ connectMongo ~ error:", error.messages);
  }
};

export default connectMongo;
