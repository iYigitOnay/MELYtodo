import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user_model.js";

// --- Constants ---
const JWT_EXPIRATION = "30d";
const RESET_TOKEN_EXPIRES_IN = 10 * 60 * 1000; // 10 minutes

// --- Helper Functions ---
const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined in the environment variables.");
    throw new Error("Sunucu yapılandırma hatası: JWT secret eksik.");
  }
  return jwt.sign({ id }, secret, {
    expiresIn: JWT_EXPIRATION,
  });
};

// --- Auth Controllers ---

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Bu email ile zaten bir kullanıcı mevcut" });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: "Geçersiz kullanıcı verisi" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/auth/login
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);
  try {
    console.log('Before User.findOne');
    const user: IUser | null = await User.findOne({ email });
    console.log('After User.findOne, user:', user ? user.email : 'not found');

    if (user && (await user.matchPassword(password))) {
      console.log('Password matched. Before generateToken');
      const token = generateToken(user._id.toString());
      console.log('Token generated. Before sending success response');
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } else {
      console.log('Invalid credentials. Before sending 401 response');
      res.status(401).json({ message: "Geçersiz email veya şifre" });
    }
  } catch (error) {
    console.error('Login error:', error); // Log the full error object
    res.status(500).json({ message: "Sunucu Hatası", error: (error as Error).message || String(error) });
  }
};

/**
 * @desc    Forgot password - generate token
 * @route   POST /api/auth/forgotpassword
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      // Even if user is not found, we send a generic success message 
      // to prevent email enumeration attacks.
      return res
        .status(200)
        .json({
          message: "Eğer email kayıtlıysa, şifre sıfırlama linki gönderildi.",
        });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN);
    await user.save();

    // Only log the token in non-production environments for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log("Reset Token (normalde email ile gider): ", resetToken);
    }

    res.json({
      message: "Eğer email kayıtlıysa, şifre sıfırlama linki gönderildi.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};

/**
 * @desc    Reset password with token
 * @route   PUT /api/auth/resetpassword/:resetToken
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
    const user: IUser | null = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Geçersiz veya süresi dolmuş anahtar" });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Şifre başarıyla güncellendi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};
