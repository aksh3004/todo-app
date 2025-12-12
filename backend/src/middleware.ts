import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export class HTTPError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const errorHandler: ErrorRequestHandler = (
  err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
}
