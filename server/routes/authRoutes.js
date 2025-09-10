import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validate } from "../middleware/validationMiddleware.js"; // EKLENDİ
import { z } from "zod";

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
  email: z.string().email("Lütfen geçerli bir e-posta adresi girin."),
  password: z.string().min(6, "Parola en az 6 karakter olmalıdır."),
});

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", loginUser);

export default router;
