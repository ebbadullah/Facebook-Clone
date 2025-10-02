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
        message: "please login first",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (decode?.userId) {
      req.userId = decode.userId;
      return next();
    }

    return res.status(401).json({
      status: false,
      message: "invalid token",
    });

  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({
      status: false,
      message: "invalid or expired token",
    });
  }
}

export default auth;
