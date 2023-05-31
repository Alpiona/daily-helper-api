import { Exception } from "@adonisjs/core/build/standalone";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { ConfigurationValues } from "App/Constants/ConfigurationValues";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import { UserStatus } from "App/Constants/UserStatus";
import User from "App/Models/User";
import { DateTime } from "luxon";
import IBaseService from "../IBaseService";

export default class UserLoginService implements IBaseService<Input, Output> {
  public async execute({ email, password, auth }: Input): Promise<Output> {
    const token = await auth.use("api").attempt(email, password, {
      expiresIn: ConfigurationValues.EMAIL_TOKEN_EXPIRATION,
    });

    const user = await User.findByOrFail("email", email);

    if (![UserStatus.ACTIVE].includes(user.status)) {
      throw new Exception(
        "User is not active, please enter in contact with support",
        401,
        "E_INACTIVE_USER"
      );
    }

    return {
      email,
      token: token.token,
      expiresAt: token.expiresAt,
    };
  }

  public schemaValidator = {
    schema: schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.minLength(6)]),
    }),
    messages: DefaultValidatorMessages,
  };
}

type Input = {
  email: string;
  password: string;
  auth: AuthContract;
};

type Output = {
  email: string;
  token: string;
  expiresAt?: DateTime;
};
