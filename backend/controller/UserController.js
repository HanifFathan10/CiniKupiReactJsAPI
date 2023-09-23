import mongooseConnection from "../models/UserModel.js";
import usersConnection from "../models/UsersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const TambahData = async (req, res) => {
  const postData = await mongooseConnection(req.body);
  try {
    const newPost = await postData.create();

    return res.status(201).json({
      status: "sukses menambah data",
      data: newPost,
    });
  } catch (error) {
    res.status(400).json({
      status: "gagal ditambahin!!",
      message: error.errors,
    });
  }
};

const TampilData = async (req, res) => {
  try {
    const view = await mongooseConnection.find();
    res.json(view);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const DetailPost = async (req, res) => {
  try {
    const posts = await mongooseConnection.findById(req.params.id);
    res.json(posts);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const TampilDataUser = async (req, res) => {
  try {
    const view = await usersConnection.find({}, ['_id', 'username', 'email']);
    res.json(view);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const RegisterData = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: "Password dan confirm password tidak sesuai!!" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await usersConnection.create({
      username,
      email,
      password: hashPassword,
      refresh_token: null
    });
    res.status(201).json({ status: true, statusCode: 201, message: "Register Berhasil!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan dalam pendaftaran" });
  }
};

export const LoginData = async (req, res) => {
  try {
    const user = await usersConnection.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        error: "user not Found",
      });
    }

    const comparePassword = (password, hash) => {
      return bcrypt.compare(password, hash);
    };
    const match = await comparePassword(req.body.password, user.password);
    if (!match) return res.status(400).json({ message: "Passwordnya salah" });

    const userId = user._id;
    const username = user.username;
    const userEmail = user.email;

    const accesToken = jwt.sign({ userEmail, username, userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });

    const refreshToken = jwt.sign({ userEmail, username, userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await usersConnection.findOneAndUpdate(
      { _id: userId }, // Kriteria pencarian
      { refresh_token: refreshToken } // Nilai yang akan diupdate
    );
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    
    res.json({ accesToken });
  } catch (error) {
    res.status(404).json({ message: "Email tidak ditemukan", error });
  }
};

export const LogoutData = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await usersConnection.find({
    refresh_token: refreshToken
  });
  if(!user) return res.sendStatus(204)
  const _id = user._id
  await usersConnection.findOneAndUpdate({refresh_token: null}, {
    where: {
      _id
    }
  })
  res.clearCookie('refresToken');
  return res.sendStatus(200)
}

export { TambahData, TampilData, DetailPost };
