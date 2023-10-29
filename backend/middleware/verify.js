import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const {authorization} = req.headers;
  if(!authorization) {
    return res.status(401).json({
      message: "Token Diperlukan!"
    })
  }

  const token = authorization.split(' ')[1]
  const secret = process.env.ACCESS_TOKEN_SECRET

  try {
    const jwtdecode = jwt.verify(token, secret);

    req.userData = jwtdecode
  } catch (error) {
    return res.status(401).json({message: "Unauthorize"})
  }

  next()
};
