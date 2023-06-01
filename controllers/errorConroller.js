const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token! Please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Token has been expired! Please log in again.", 401);

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const devError = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) Rendered Website
  console.log("Error 💥💥", err);
  return res
    .status(err.statusCode)
    .render("error", { title: "Something went wrong!", msg: err.message });
};

const prodError = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log Error
    console.log("Error 💥💥", err);

    // 2) Send generic message
    return res
      .status(500)
      .json({ status: "error", message: "Something went wrong" });
  }

  // B) Rendered website
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .render("error", { title: "Something went wrong!", msg: err.message });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log Error
  console.log("Error 💥💥", err);

  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    msg: "Plaese try again later",
    title: "Something went wrong",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    devError(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    prodError(error, req, res);
  }
};
