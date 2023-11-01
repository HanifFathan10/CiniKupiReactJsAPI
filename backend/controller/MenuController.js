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
  try {
    const InsertMenu = await menuConnections.create(req.body);

    res.status(201).json({
      message: "Insert Data Successfuly",
      data: InsertMenu,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
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
    const response = await menuConnections.findOne({ _id: req.params.id });

    return res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const TambahMenuById = async (req, res) => {
  try {
    const menu = await menuConnections.findOneAndReplace({ _id: req.params.id }, req.body, { new: true });
    res.status(200).json({ message: "Insert data successfuly", data: menu });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const updateNestedData = async (req, res) => {
  console.log(req.params);
  const orderId = req.params.id;
  try {
    const result = await menuConnections.findOneAndUpdate({ "product._id": orderId }, { $set: { "product.$": req.body } }, { new: true });

    console.log(result);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "something went wrong" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getNestedDataById = async (req, res) => {
  try {
    const result = await menuConnections.findOne({ "product._id": req.params.id });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
};

export const insetNestedById = async (req, res) => {
  try {
    const create = await menuConnections.create({});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somethink went wrong" });
  }
};


export { TambahData, TampilData, DetailPost, TambahMenu, TampilMenu, getMenuById, TambahMenuById };
