import usersConnection from "../models/UsersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const TampilDataUser = async (req, res) => {
  try {
    const view = await usersConnection.find({}, ["_id", "username", "email"]);
    res.json(view);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const RegisterData = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: "Password dan confirm password tidak sesuai!!" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const users = await usersConnection.findOne({ email: email });

    if (email === users?.email) {
      return res.status(401).json({
        message: "Email sudah terdaftar",
      });
    }
    await usersConnection.create({
      username,
      email,
      password: hashPassword,
      refresh_token: null,
    });
    res.status(201).json({ status: true, statusCode: 201, message: "Register Berhasil!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan dalam pendaftaran" });
  }
};

export const LoginData = async (req, res) => {
  const { email, password } = req.body;

  const users = await usersConnection.findOne({ email: email });
  if (!users) {
    return res.status(404).json({
      message: "user not Found",
    });
  }

  if (!users.password) {
    return res.status(404).json({
      message: "password not found",
    });
  }

  const comparePassword = await bcrypt.compare(password, users.password);

  if (comparePassword) {
    const payload = {
      _id: users?._id,
      username: users?.username,
      email: users?.email,
      refresh_token: users?.refresh_token,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '60s',
    });

    await usersConnection.findOneAndUpdate(
      { _id: users._id }, // Kriteria pencarian
      { refresh_token: refreshToken } // Nilai yang akan diupdate
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1,
    });

    return res.status(200).json({ data: {
        id: users._id,
        username: users.username,
        email: users.email,
      },
      accessToken
    });
  } else {
    return res.status(404).json({ message: "Wrong password" });
  }
};

export const LogoutData = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await usersConnection.find({
    refresh_token: refreshToken,
  });
  if (!user) return res.sendStatus(204);
  const _id = user._id;
  await usersConnection.findOneAndUpdate(
    { _id: user._id },
    { refresh_token: null }
  );
  res.clearCookie("refresToken");
  return res.sendStatus(200);
};
