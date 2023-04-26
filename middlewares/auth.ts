import { AUTH_TOKEN } from "../env.ts";
import { NextFunction } from "../deps.ts";
import CommonRequest from "../types/commonRequest.type.ts";
import CommonResponse from "../types/commonResponse.type.ts";

export default function auth(req: CommonRequest, res: CommonResponse, next: NextFunction) {
  if (req.headers.get("auth_token") === AUTH_TOKEN) next();
  else res.setStatus(401).send({ message: null, error: "Unauthorized" });
}
