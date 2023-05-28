import handleError from "./handleError.ts";
import { Joi, NextFunction } from "../deps.ts";
import CommonResponse from "../types/commonResponse.type.ts";
import CommonRequestPartial, { isCommonRequest } from "../types/commonRequest.type.ts";

// params is for /:[param] requests
// query is for GET requests with ?key=value
// body is for POST, PUT, PATCH requests with JSON body
export type Element = "body" | "query" | "params";

const getDescription = (error: Joi.ValidationError | undefined) =>
  error ? `Validation error: ${error.details.map((x) => x.message).join(", ")}`.replace(/\"/g, "'") : false;

// https://jasonwatmore.com/post/2020/07/22/nodejs-express-api-request-schema-validation-with-joi
export default function validateRequest(
  req: CommonRequestPartial,
  res: CommonResponse,
  next: NextFunction | undefined,
  schema: Joi.Schema,
  element: Element = "body"
) {
  if (!isCommonRequest(req)) return handleError(res, { description: "req is not a CommonRequest" });

  const options = {
    convert: true,
    abortEarly: true, // incluír solo el primer error
    stripUnknown: true, // eliminar los unknown
  };
  const { error, value } = schema.validate(req[element], options);

  // Si solo se está probando el esquema retornar el resultado de la validación
  // y se sabe que se estla probando el esquema si next no está definido
  if (!next) return { error: getDescription(error), value };

  if (error) return handleError(res, { description: getDescription(error), details: error.details });

  req[element] = value;
  next();
}
