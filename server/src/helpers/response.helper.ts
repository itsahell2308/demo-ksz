import { Response } from "express";

export const success = (res: Response, message: string, data: any) => {
  res.status(200).json({
    status: true,
    code: 200,
    message,
    data,
  });
};

export const invalid = (res: Response, message: string = "Invalid data.") => {
  const code = 200;
  res.status(code).json({
    status: true,
    code,
    message,
    data: null,
  });
};

export const error = (res: Response, err: any) => {
  const code =
    typeof err === "object" ? err.statusCode ?? err.code ?? 403 : 403;

  const message =
    typeof err === "object" ? err.message : err || "Something went wrong";
  res.status(code).json({
    status: false,
    code,
    message,
    data: null,
  });
};
