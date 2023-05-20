import CommonResponse from "../types/commonResponse.type.ts";

// deno-lint-ignore no-explicit-any
export default function handleError(res: CommonResponse, err: any, code = 400) {
  res.setStatus(code).send({ message: null, error: err?.message || err });
}
