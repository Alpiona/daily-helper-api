import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export const ErrorCodesHandler = {
  E_ROW_NOT_FOUND: (ctx: HttpContextContract, error: any) =>
    ctx.response.notFound({
      errors: [{ message: "Resource not found", code: error.code }],
      data: {},
    }),
  E_UNAUTHORIZED_ACCESS: (ctx: HttpContextContract, error: any) =>
    ctx.response.unauthorized({
      errors: [{ message: "Access unauthorized", code: error.code }],
      data: {},
    }),
  E_VALIDATION_FAILURE: (ctx: HttpContextContract, error: any) =>
    ctx.response.unprocessableEntity({
      errors: error.messages.errors.map((error) => ({
        message: error.message,
        code: error.code,
      })),
      data: {},
    }),
  E_INVALID_AUTH_UID: (ctx: HttpContextContract, _error: any) =>
    ctx.response.unauthorized({
      errors: [
        { message: "Invalid credentials", code: "E_INVALID_CREDENTIALS" },
      ],
      data: {},
    }),
  E_INVALID_AUTH_PASSWORD: (ctx: HttpContextContract, _error: any) =>
    ctx.response.unauthorized({
      errors: [
        { message: "Invalid credentials", code: "E_INVALID_CREDENTIALS" },
      ],
      data: {},
    }),
  E_UNIQUE_EMAIL: (ctx: HttpContextContract, error: any) =>
    ctx.response.conflict({
      errors: [{ message: "E-mail already in use", code: error.code }],
      data: {},
    }),
};
