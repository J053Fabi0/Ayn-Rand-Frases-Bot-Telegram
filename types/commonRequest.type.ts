// deno-lint-ignore-file no-explicit-any
import { OpineRequest, Params, ParamsDictionary } from "../deps.ts";

export default interface CommonRequest<
  Body = Record<string, any>,
  Query = Record<string, any>,
  P extends Params = ParamsDictionary
> extends OpineRequest<P, Body, Query> {
  body: Body;
}
