import { Joi, NextFunction } from "../deps.ts";
import CommonRequest from "../types/commonRequest.type.ts";
import CommonResponse from "../types/commonResponse.type.ts";
import validateRequest, { Element } from "../utils/validateRequest.ts";

export const joi = Joi.defaults((schema) => {
  switch (schema.type) {
    default:
      return schema;
  }
});

export const a =
  (schema: Joi.Schema, element?: Element) => (req: CommonRequest, res: CommonResponse, next: NextFunction) =>
    validateRequest(req, res, next, schema, element);

export const id = joi.string().length(24).hex();
