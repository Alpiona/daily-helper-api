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

    const output = await service.execute({ ...input, auth });

    return response.ok({
      data: output,
      errors: [],
    });
  }

  public async create({ request, response, auth }: HttpContextContract) {
    const service = new UserCreateService();

    const input = await request.validate(service.schemaValidator);

    await service.execute({ ...input, auth });

    return response.created({ data: {}, errors: [] });
  }

  public async active({ response, auth }: HttpContextContract) {
    const service = new UserActiveService();

    const user = auth.user;

    await service.execute({ userId: user!.id });

    return response.ok({ data: {}, errors: [] });
  }

  public async sendResetPasswordEmail({
    request,
    response,
    auth,
  }: HttpContextContract) {
    const service = new UserSendResetPasswordEmailService();

    const input = await request.validate(service.schemaValidator);

    await service.execute({ ...input, auth });

    return response.ok({ data: {}, errors: [] });
  }

  public async resetPassword({ request, response, auth }: HttpContextContract) {
    const service = new UserResetPasswordService();

    const input = await request.validate(service.schemaValidator);

    await service.execute({ ...input, auth });

    return response.ok({ data: {}, errors: [] });
  }
}
