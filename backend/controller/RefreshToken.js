import jwt from "jsonwebtoken";
import usersConnection from "../models/UsersModel.js";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await usersConnection.find({
      refresh_token: refreshToken
    });

    if (!user) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const _id = user?._id;
      const username = user?.username;
      const email = user?.email;

      const accessToken = jwt.sign({ _id, username, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};
