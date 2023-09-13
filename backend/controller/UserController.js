import mongooseConnection from "../models/UserModel.js";

const TambahData = async (req, res) => {
  const postData = await mongooseConnection(req.body);
  try {
    const newPost = await postData.save();

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
    // return res.status(200).json({
    //   status: "sukses gasken",
    //   data: posts,
    // });
    res.json(posts);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export { TambahData, TampilData, DetailPost };
