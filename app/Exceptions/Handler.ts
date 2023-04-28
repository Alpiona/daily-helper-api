import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";
import Logger from "@ioc:Adonis/Core/Logger";
import { ErrorCodesHandler } from "App/Constants/ErrorCodeHandler";

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  public async handle(error: any, ctx: HttpContextContract) {
    console.log(error);
    console.log(error.code);
    console.log(error.status);
    console.log(error.message);

    if (error.code && error.code in ErrorCodesHandler) {
      return ErrorCodesHandler[error.code](ctx, error);
    }

    if (error.name === "Exception" && error.status !== 500) {
      return ctx.response
        .status(error.status)
        .send({ data: {}, errors: [{ message: error.message }] });
    }

    return ctx.response.status(500).send({
      data: {},
      errors: [
        { message: "Sorry! Internal server error! Please try again later." },
      ],
    });
  }
}
