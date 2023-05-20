import CommonRequest from "../types/commonRequest.type.ts";
import { Joi, NextFunction, ObjectSchema } from "../deps.ts";
import CommonResponse from "../types/commonResponse.type.ts";
import validateRequest, { Element } from "../utils/validateRequest.ts";

export const joi = Joi.defaults((schema) => {
  switch (schema.type) {
    case "object":
      return (schema as ObjectSchema).custom((value) => {
        // rename id to _id for every object schema
        if ("id" in value) {
          value._id = value.id;
          delete value.id;
        }
        return value;
      });

    default:
      return schema;
  }
});

export const a =
  (schema: Joi.Schema, element?: Element) => (req: CommonRequest, res: CommonResponse, next: NextFunction) =>
    validateRequest(req, res, next, schema, element);

export const id = joi.string().length(24).hex();
