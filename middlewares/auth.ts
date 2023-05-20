import { AUTH_TOKEN } from "../env.ts";
import { NextFunction } from "../deps.ts";
import CommonResponse from "../types/commonResponse.type.ts";
import { AuthRequest } from "../types/api/auth.type.ts";

export default async function auth({ query }: AuthRequest, res: CommonResponse, next: NextFunction) {
  // wait a random ammout of time to prevent brute force attacks
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));

  if (query.token === AUTH_TOKEN) next();
  else res.setStatus(401).send({ message: null, error: "Unauthorized" });
}
