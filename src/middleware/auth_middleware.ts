import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user_model.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Yetki yok, kullanıcı bulunamadı" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Yetki yok, token geçersiz" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Yetki yok, token bulunamadı" });
  }
};

export { protect };
