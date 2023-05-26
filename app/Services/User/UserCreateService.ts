import { Exception } from "@adonisjs/core/build/standalone";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import User from "App/Models/User";
import IBaseService from "../IBaseService";

export default class UserCreateService implements IBaseService<Input, Output> {
  public async execute({
    email,
    password,
    auth,
    locale,
  }: Input): Promise<Output> {
    try {
      await User.create({
        email,
        password,
        // status: UserStatus.WAITING_CONFIRMATION,
      });
    } catch (err) {
      if (err.constraint === "users_email_unique") {
        throw new Exception("Email already exists", 409, "E_UNIQUE_EMAIL");
      }

      throw err;
    }

    // const user = await User.findBy("email", email);

    // if (!user) {
    //   await User.create({
    //     email,
    //     password,
    //     status: UserStatus.WAITING_CONFIRMATION,
    //   });
    // } else if (user && user.status === UserStatus.WAITING_CONFIRMATION) {
    //   user.password = password;
    //   await user.save();
    // } else if (user && user.status !== UserStatus.WAITING_CONFIRMATION) {
    //   throw new Exception("Email already in use", 409, "E_UNIQUE_RESOURCE");
    // }

    // const token = await auth.use("api").attempt(email, password, {
    //   expiresIn: ConfigurationValues.EMAIL_TOKEN_EXPIRATION,
    // });

    // const confirmationUrl = `${Env.get(
    //   "ORGANEZEE_URL"
    // )}/auth/sign-up-confirmation?token=${token.token}`;

    // const view = await View.render(`emails/${locale}/new_user.edge`, {
    //   confirmationUrl,
    // });

    // const html = mjml(view).html;

    // const emailTitle =
    //   locale === "en"
    //     ? "Organezee - Registration Confirmation"
    //     : "Organezee - Confirmação de Registro";

    // await Mail.sendLater((message) => {
    //   message
    //     .from(Env.get("ORGANEZEE_NO_REPLY_EMAIL"))
    //     .to(email)
    //     .subject(emailTitle)
    //     .html(html);
    // });
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
