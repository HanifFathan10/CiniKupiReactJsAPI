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
    if (!username && !email && !password && !confirmPassword) return res.status(401).json({ message: "Input tidak boleh kosong!!" });
    if (!email && !password && !confirmPassword) return res.status(401).json({ message: "email dan password tidak boleh kosong!!" });
    if (password !== confirmPassword) return res.status(401).json({ message: "Password dan confirm password tidak sesuai!!" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const users = await usersConnection.findOne({ email });

    if (users) {
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
  if (!email && !password) return res.status(400).json({ message: "Email dan Password wajib diisi!!" });

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
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await usersConnection.updateOne(
      { _id: users._id }, // Kriteria pencarian
      { $set: { refresh_token: refreshToken } } // Nilai yang akan diupdate
    );
    res.cookie("refreshToken", refreshToken, {
      secure: true, // aktifkan jika mengakses menggunakan https
      maxAge: 3600000,
      sameSite: "none",
    });
    console.log("cookie created successfully");

    return res.json({
      data: {
        username: users.username,
        email: users.email,
      },
      accessToken,
    });
  } else {
    return res.status(404).json({ message: "Wrong password" });
  }
};

export const LogoutData = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const user = await usersConnection.findOne({
      refresh_token: refreshToken,
    });
    if (!user) return res.json({ message: "user not found" });

    await usersConnection.updateOne({ _id: user._id }, { $set: { refresh_token: null } });
    if (refreshToken == user.refresh_token) {
      res.clearCookie("refreshToken");
    } else {
      res.json({ message: "refresh token not found" });
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};
