import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Geçersiz veri.",
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};
