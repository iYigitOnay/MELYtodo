import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Kullanıcı belgesinin (veritabanındaki tek bir satırın) nasıl görüneceğini tanımlayan Interface
// _id ve matchPassword metodunu buraya ekliyoruz
export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordResetToken?: string; // Optional field
  passwordResetExpires?: Date;   // Optional field
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetToken: { 
    type: String 
  },
  passwordResetExpires: { 
    type: Date 
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Metodun bir Promise<boolean> döndüreceğini belirtiyoruz
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Model'i oluştururken de IUser tipini kullanıyoruz
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;