import jwt from "jsonwebtoken";
function generateToken(res, userId) {
  try {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', 
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: '.onrender.com' 
    });

    console.log('✅ Token generated for user:', userId);
  } catch (error) {
    console.error("Generate Token Error:", error.message);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}

export default generateToken;
