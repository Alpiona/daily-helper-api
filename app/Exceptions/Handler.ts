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
    }

    return super.handle(error, ctx);
  }
}
