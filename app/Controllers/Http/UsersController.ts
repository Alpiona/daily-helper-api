import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserActiveService from "App/Services/User/UserActiveService";
import UserCreateService from "App/Services/User/UserCreateService";
import UserLoginService from "App/Services/User/UserLoginService";
import UserResetPasswordService from "App/Services/User/UserResetPasswordService";
import UserSendResetPasswordEmailService from "App/Services/User/UserSendResetPasswordEmailService";

export default class UsersController {
  public async login({ request, response, auth }: HttpContextContract) {
    const service = new UserLoginService();

    const input = await request.validate(service.schemaValidator);

    try {
      const output = await service.execute({ ...input, auth });

      return response.ok({
        data: output,
      });
    } catch {
      return response.unauthorized({
        errors: [{ message: "Invalid credentials" }],
      });
    }
  }

  public async create({ request, response }: HttpContextContract) {
    const service = new UserCreateService();

    const input = await request.validate(service.schemaValidator);

    try {
      await service.execute(input);

      return response.created();
    } catch (err) {
      if (err.constraint === "users_email_unique") {
        return response.conflict({
          errors: [{ message: "Email already in use" }],
        });
      }
    }
  }

  public async active({ response, auth }: HttpContextContract) {
    const service = new UserActiveService();

    const user = auth.user;

    await service.execute({ userId: user!.id });

    return response.noContent();
  }

  public async sendResetPasswordEmail({
    request,
    response,
    auth,
  }: HttpContextContract) {
    const service = new UserSendResetPasswordEmailService();

    const input = await request.validate(service.schemaValidator);

    await service.execute({ ...input, auth });

    return response.noContent();
  }

  public async resetPassword({ request, response, auth }: HttpContextContract) {
    const service = new UserResetPasswordService();

    const input = await request.validate(service.schemaValidator);

    await service.execute({ ...input, auth });

    return response.noContent();
  }
}
