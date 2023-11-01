import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String
  },
  price: {
    type: Number,
  },
  image: {
    type: String
  }
})

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    product: [productSchema],
  },
  {
    timestamps: true,
  }
);

const menuConnections = new mongoose.model("cinikupimenus", schema);

export default menuConnections;
