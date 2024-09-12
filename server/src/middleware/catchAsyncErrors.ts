import { Request, Response, NextFunction } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any;

const asyncHandler = (thefunc: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(thefunc(req, res, next)).catch(next);
};

export default asyncHandler;