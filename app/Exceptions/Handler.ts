import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";
import Logger from "@ioc:Adonis/Core/Logger";

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  public async handle(error: any, ctx: HttpContextContract) {
    switch (error.code) {
      case "E_ROW_NOT_FOUND":
        return ctx.response.notFound({
          errors: [{ message: "Resource not found" }],
        });

      case "E_UNAUTHORIZED_ACCESS":
        return ctx.response.unauthorized({
          errors: [{ message: "Access unauthorized" }],
        });

      case "E_VALIDATION_FAILURE":
        return ctx.response.unprocessableEntity({
          errors: error.messages.errors.map((error) => ({
            message: error.message,
          })),
        });
    }

    return super.handle(error, ctx);
  }
}
