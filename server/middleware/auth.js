import jwt from "jsonwebtoken";

function auth(req, res, next) {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "please continue to login",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (decode.userId) {
      req.userId = decode.userId;
      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "please provide a valid token",
      });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export default auth;
