import jwt from "jsonwebtoken";

function auth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(400).json({
        status: false,
        message: "please continue to login",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (decode.userId) {
      req.userId = decode.userId;
      next();
    } else {
      return res.status(400).json({
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
