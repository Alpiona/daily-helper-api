import { Exception } from "@adonisjs/core/build/standalone";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import View from "@ioc:Adonis/Core/View";
import { ConfigurationValues } from "App/Constants/ConfigurationValues";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import { UserStatus } from "App/Constants/UserStatus";
import User from "App/Models/User";
import mjml from "mjml";
import IBaseService from "../IBaseService";

export default class UserCreateService implements IBaseService<Input, Output> {
  public async execute({
    email,
    password,
    auth,
    locale,
  }: Input): Promise<Output> {
    const user = await User.findBy("email", email);

    if (user && user.status !== UserStatus.WAITING_CONFIRMATION) {
      throw new Exception("Email already in use", 409, "E_UNIQUE_EMAIL");
    } else {
      await User.updateOrCreate(
        { email },
        {
          email,
          password,
          status: UserStatus.WAITING_CONFIRMATION,
        }
      );
    }

    const { token } = await auth.use("api").attempt(email, password, {
      expiresIn: ConfigurationValues.EMAIL_TOKEN_EXPIRATION,
    });

    await this.sendEmailForConfirmation(email, token, locale);
  }

  private async sendEmailForConfirmation(
    email: string,
    token: string,
    locale: string
  ): Promise<void> {
    const confirmationUrl = `${Env.get(
      "ORGANEZEE_URL"
    )}/auth/sign-up-confirmation?token=${token}`;

    const view = await View.render(`emails/${locale}/new_user.edge`, {
      confirmationUrl,
    });

    const html = mjml(view).html;

    const emailTitle =
      locale === "en"
        ? "Organezee - Registration Confirmation"
        : "Organezee - Confirmação de Registro";

    await Mail.sendLater((message) => {
      message
        .from(Env.get("ORGANEZEE_NO_REPLY_EMAIL"))
        .to(email)
        .subject(emailTitle)
        .html(html);
    });
  }

  public schemaValidator = {
    schema: schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [
        rules.minLength(6),
        rules.confirmed("passwordConfirmation"),
      ]),
      locale: schema.string(),
    }),
    messages: DefaultValidatorMessages,
  };
}

type Input = {
  email: string;
  password: string;
  auth: AuthContract;
  locale: string;
};

type Output = void;
