// deno-lint-ignore-file no-explicit-any
import RequiredUnion from "./RequiredUnion.type.ts";
import { OpineRequest, Params, ParamsDictionary } from "../deps.ts";

type RecordAny = { [key: string]: any };

export type CommonRequest<
  Body extends RecordAny | undefined = undefined,
  Query extends RecordAny | undefined = undefined,
  P extends Params | undefined = undefined
> = Omit<
  OpineRequest<
    P extends undefined ? ParamsDictionary : P,
    Body extends undefined ? RecordAny : Body,
    Query extends undefined ? RecordAny : Query
  >,
  "body" | "query" | "params"
> & { body: Body; query: Query; params: P };

export function isCommonRequest(req: unknown): req is CommonRequest {
  return typeof req === "object" && req !== null && "body" in req && "query" in req && "params" in req;
}

/**
 * CommonRequestPartial is like CommonRequest but every field is optional except body, query and
 * params, which are only in the type if they are not undefined.
 * This is useful to call the controllers directly from any part of the code.
 */
type CommonRequestPartial<
  Body extends RecordAny | undefined = undefined,
  Query extends RecordAny | undefined = undefined,
  P extends Params | undefined = undefined
> = Omit<
  RequiredUnion<Partial<CommonRequest<Body, Query, P>>, "body" | "query" | "params">,
  // if Body is undefined, then body is not in the type. The same for Query and P
  | (Body extends undefined ? "body" : never)
  | (Query extends undefined ? "query" : never)
  | (P extends undefined ? "params" : never)
>;

export default CommonRequestPartial;
