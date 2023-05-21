import { AUTH_TOKEN } from "../env.ts";
import { NextFunction, compare } from "../deps.ts";
import { AuthRequest } from "../types/api/auth.type.ts";
import CommonResponse from "../types/commonResponse.type.ts";

export default async function auth({ query }: AuthRequest, res: CommonResponse, next: NextFunction) {
  // wait a random ammout of time to prevent brute force attacks
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));

  if (await compare(query.token, AUTH_TOKEN)) next();
  else res.setStatus(401).send({ message: null, error: "Unauthorized" });
}
