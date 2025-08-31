import jwt from "jsonwebtoken";

function generateToken(res, userId) {
    try {
        let token = jwt.sign({ userId }, process.env.SECRET_KEY, {
            expiresIn: "7d"
        });
        
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

export default generateToken;