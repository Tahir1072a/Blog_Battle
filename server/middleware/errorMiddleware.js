class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Geçersiz veri: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  let message;
  switch (field) {
    case "email":
      message = "Bu e-posta adresi zaten kullanılıyor.";
      break;
    case "title":
      message = "Bu başlıkta zaten bir yazınız bulunuyor.";
      break;
    default:
      message = `${field} alanı için '${value}' değeri zaten kullanılıyor.`;
  }

  return new AppError(message, 400);
};

const handleCastError = (err) => {
  const message = `Geçersiz ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Geçersiz token. Lütfen tekrar giriş yapın.", 401);

const handleJWTExpiredError = () =>
  new AppError("Token süresi dolmuş. Lütfen tekrar giriş yapın.", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Sunucu hatası oluştu!",
    });
  }
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message };

    if (err.name === "ValidationError") {
      error = handleValidationError(error);
    }

    if (err.code === 11000) {
      error = handleDuplicateKeyError(error);
    }

    if (err.name === "CastError") {
      error = handleCastError(error);
    }

    if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    }

    if (err.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export const notFoundHandler = (req, res, next) => {
  const err = new AppError(`${req.originalUrl} endpoint'i bulunamadı.`, 404);
  next(err);
};

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

export { AppError };
