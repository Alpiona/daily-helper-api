import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export const ErrorCodesHandler = {
  E_ROW_NOT_FOUND: (ctx: HttpContextContract, _error: any) =>
    ctx.response.notFound({
      errors: [{ message: "Resource not found" }],
      data: {},
    }),
  E_UNAUTHORIZED_ACCESS: (ctx: HttpContextContract, _error: any) =>
    ctx.response.unauthorized({
      errors: [{ message: "Access unauthorized" }],
      data: {},
    }),
  E_VALIDATION_FAILURE: (ctx: HttpContextContract, error: any) =>
    ctx.response.unprocessableEntity({
      errors: error.messages.errors.map((error) => ({
        message: error.message,
      })),
      data: {},
    }),
  E_INVALID_AUTH_UID: (ctx: HttpContextContract, _error: any) =>
    ctx.response.unauthorized({
      errors: [{ message: "Invalid credentials" }],
      data: {},
    }),
  E_INVALID_AUTH_PASSWORD: (ctx: HttpContextContract, _error: any) =>
    ctx.response.unauthorized({
      errors: [{ message: "Invalid credentials" }],
      data: {},
    }),
};
