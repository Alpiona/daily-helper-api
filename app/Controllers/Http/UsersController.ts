import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserCreateValidator from "App/Validators/Users/UserCreateValidator";
import UserLoginValidator from "App/Validators/Users/UserLoginValidator";

export default class UsersController {
  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = await request.validate(UserLoginValidator);

    try {
      const token = await auth
        .use("api")
        .attempt(email, password, { expiresIn: "1 day" });

      return response.ok({
        email,
        token: token.token,
        expiresAt: token.expiresAt,
      });
    } catch {
      return response.unauthorized({
        errors: [{ message: "Invalid credentials" }],
      });
    }
  }

  public async create({ request, response }: HttpContextContract) {
    const { email, password } = await request.validate(UserCreateValidator);

    try {
      await User.create({ email, password });

      return response.created();
    } catch (err) {
      if (err.constraint === "users_email_unique") {
        return response.conflict({
          errors: [{ message: "Email already in use" }],
        });
      }

      return response.abort(err);
    }
  }
}
