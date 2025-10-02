import jwt from "jsonwebtoken";

function generateToken(res, userId) {
  try {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // prod me true hoga
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("✅ Token generated for user:", userId);
  } catch (error) {
    console.error("❌ Generate Token Error:", error.message);
    // token banane me error aaye to response crash na ho
    if (!res.headersSent) {
      res.status(500).json({
        status: false,
        message: "token generation failed",
      });
    }
  }
}

export default generateToken;
