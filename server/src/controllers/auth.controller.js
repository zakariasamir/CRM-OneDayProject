import { compareSync, hash } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import User from "../models/user.model.js";
const { JWT_SECRET } = process.env;
const { JWT_EXPIRATION } = process.env;

// export const register = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = await hash(password, 10);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: "employer",
//     });
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error registering user" });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Login failed: Missing required information!",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseInt(JWT_EXPIRATION) * 60 * 60 * 1000,
      })
      .json({
        message: "Login Successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    return res
      .status(500)
      .json([
        { error: "Internal server error" },
        { message: `Error logging in User: ${error.message}` },
      ]);
  }
};

export const fetchCurrentUser = async (req, res) => {
  try {
    console.log("Fetching current user" , req.cookies.token);
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json([
        { error: "Internal server error" },
        { message: `Error fetching current user: ${error.message}` },
      ]);
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
  } catch (error) {
    return res
      .status(500)
      .json([
        { error: "Internal server error" },
        { message: `Error logging out User: ${error.message}` },
      ]);
  }
};
