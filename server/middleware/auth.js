import jwt from "jsonwebtoken";

function auth(req, res, next) {
  try {
    let token = req.cookies?.token;
    if (!token) {
      return res.status(400).json({
        status: false,
        message: "please continue to login",
      });
    }
    let decode = jwt.verify(token, process.env.SECRET_KEY);
    if (decode.userId) {
      req.userId = decode.userId;
      next();
    } else {
      res.status(400).json({
        status: false,
        message: "please provide a valid token",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "internal server error",
    });
  }
}

export default auth;
