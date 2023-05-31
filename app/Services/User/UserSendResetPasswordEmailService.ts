import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import View from "@ioc:Adonis/Core/View";
import { ConfigurationValues } from "App/Constants/ConfigurationValues";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import User from "App/Models/User";
import mjml from "mjml";
import IBaseService from "../IBaseService";

export default class UserSendResetPasswordEmailService
  implements IBaseService<Input, Output>
{
  public async execute({ email, auth }: Input): Promise<Output> {
    const user = await User.findByOrFail("email", email);

    const { token } = await auth.use("api").generate(user, {
      expiresIn: ConfigurationValues.EMAIL_TOKEN_EXPIRATION,
    });

    await this.sendResetPasswordEmail(token, email);
  }

  public schemaValidator = {
    schema: schema.create({
      email: schema.string({}, [rules.email()]),
    }),
    messages: DefaultValidatorMessages,
  };

  private async sendResetPasswordEmail(
    token: string,
    email: string
  ): Promise<void> {
    const resetPasswordUrl = `${Env.get(
      "ORGANEZEE_URL"
    )}/auth/reset-password?token=${token}`;

    const view = await View.render("emails/reset_password", {
      resetPasswordUrl,
    });

    const html = mjml(view).html;

    await Mail.sendLater((message) => {
      message
        .from(Env.get("ORGANEZEE_NO_REPLY_EMAIL"))
        .to(email)
        .subject("Reset Password!")
        .html(html);
    });
  }
}

type Input = {
  email: string;
  auth: AuthContract;
};

type Output = void;
