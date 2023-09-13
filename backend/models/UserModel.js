import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseConnection = mongoose.model("ciniKupi", schema);

export default mongooseConnection;
