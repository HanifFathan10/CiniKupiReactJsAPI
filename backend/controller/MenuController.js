import menuConnections from "../models/MenuModel.js";
import mongooseConnection from "../models/UserModel.js";

// Product
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

// Menu
const TambahMenu = async (req, res) => {
  const postData = await menuConnections(req.body);
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

const TampilMenu = async (req, res) => {
  try {
    const view = await menuConnections.find();
    res.json(view);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getMenuById = async (req, res) => {
  try {
    const response = await menuConnections.findById(req.params.id);

    return res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export { TambahData, TampilData, DetailPost, TambahMenu, TampilMenu, getMenuById };
