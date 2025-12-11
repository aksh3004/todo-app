import { Request, Response, NextFunction } from "express";

export class HTTPError extends Error {
  status?: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(
  err: HTTPError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
}
