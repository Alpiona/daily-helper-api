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
  public async execute({ email, password, auth }: Input): Promise<Output> {
    const user = await User.findBy("email", email);

    if (!user) {
      await User.create({
        email,
        password,
        status: UserStatus.WAITING_CONFIRMATION,
      });
    } else if (user && user.status !== UserStatus.WAITING_CONFIRMATION) {
      throw new Exception("Email already in use", 409);
    }

    const token = await auth.use("api").attempt(email, password, {
      expiresIn: ConfigurationValues.EMAIL_TOKEN_EXPIRATION,
    });

    const confirmationUrl = `${Env.get(
      "ORGANEZEE_URL"
    )}/auth/sign-up-confirmation?token=${token.token}`;

    const view = await View.render("emails/new_user.edge", {
      confirmationUrl,
    });

    const html = mjml(view).html;

    await Mail.sendLater((message) => {
      message
        .from(Env.get("ORGANEZEE_NO_REPLY_EMAIL"))
        .to(email)
        .subject("Organezee Registration Confirmation")
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
    }),
    messages: DefaultValidatorMessages,
  };
}

type Input = {
  email: string;
  password: string;
  auth: AuthContract;
};

type Output = void;
