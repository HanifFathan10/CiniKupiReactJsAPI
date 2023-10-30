import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    product: [
      {
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
        image: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const menuConnections = new mongoose.model("cinikupimenus", schema);

export default menuConnections;
