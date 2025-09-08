import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim alanı zorunludur."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "E-posta alanı zorunludur."],
      unique: true,
      match: [/.+\@.+\..+/, "Lütfen geçerli bir e-posta adresi girin."],
    },
    password: {
      type: String,
      required: [true, "Parola alanı zorunludur."],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
