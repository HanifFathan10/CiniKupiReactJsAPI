import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const usersConnection = mongoose.model("users", schema);

export default usersConnection;
