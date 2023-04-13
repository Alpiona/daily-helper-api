import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import View from "@ioc:Adonis/Core/View";
import { ConfigurationValues } from "App/Constants/ConfigurationValues";
import User from "App/Models/User";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import mjml from "mjml";
import IBaseService from "../IBaseService";

export default class UserSendResetPasswordEmailService
  implements IBaseService<Input, Output>
{
  public async execute({ email, auth }: Input): Promise<Output> {
    const { password } = await User.findByOrFail("email", email);

    const token = await auth
      .use("api")
      .attempt(email, password, {
        expiresIn: ConfigurationValues.EMAIL_TOKEN_EXPIRATION,
      });

    const url = `${Env.get(
      "ORGANEZEE_URL"
    )}/auth/reset-password?token=${token}`;

    const html = mjml(View.render("emails/reset-password", { url })).html;

    await Mail.sendLater((message) => {
      message
        .from(Env.get("ORGANEZEE_NO_REPLY_EMAIL"))
        .to(email)
        .subject("Reset Password!")
        .html(html);
    });
  }

  public schemaValidator = {
    schema: schema.create({
      email: schema.string({}, [rules.email()]),
    }),
    messages: ValidatorHelper.getDefaultValidatorMessages,
  };
}

type Input = {
  email: string;
  auth: AuthContract;
};

type Output = void;
