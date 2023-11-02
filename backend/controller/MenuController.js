import menuConnections from "../models/MenuModel.js";
import mongooseConnection from "../models/UserModel.js";

// Product
export const TambahData = async (req, res) => {
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

export const TampilData = async (req, res) => {
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

export const DetailPost = async (req, res) => {
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
export const TambahMenu = async (req, res) => {
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

export const TampilMenu = async (req, res) => {
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

export const getMenuById = async (req, res) => {
  try {
    const response = await menuConnections.findOne({ _id: req.params.id });

    return res.status(201).json({ message: "Get Data By Id Successfully", data: response });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getNestedMenuById = async (req, res) => {
  try {
    const response = await menuConnections.findOne(
      { "product._id": req.params.id },
      {
        "product.$": 1,
      }
    );

    return res.status(200).json({
      message: "Get Nested Data Successfuly",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      message: "Somethink went wrong",
      error: error.message,
    });
  }
};

export const InsertNestedDataById = async (req, res) => {
  try {
    const productId = req.params.id; // Ambil ID dokumen yang ingin diperbarui
    const newProductData = req.body; // Ambil data produk baru dari body permintaan

    // Gunakan metode findOneAndUpdate untuk menambahkan produk ke dokumen yang ada
    const result = await menuConnections.findOneAndUpdate({ _id: productId }, { $push: { product: newProductData } }, { returnOriginal: false });

    if (result) {
      res.status(201).json({
        message: "Product added successfully",
        data: result,
      });
    } else {
      res.status(404).json({
        message: "Document not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const UbahMenuById = async (req, res) => {
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

export const getNameByUrl = async (req, res) => {
  try {
    try {
      const response = await menuConnections.findOne({ nameurl: req.params.nameurl });

      return res.status(200).json({ message: "Get Data By nameurl Successfully", data: response });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  } catch (error) {}
};
