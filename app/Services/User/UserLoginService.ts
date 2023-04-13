import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { ConfigurationValues } from "App/Constants/ConfigurationValues";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import { DateTime } from "luxon";
import IBaseService from "../IBaseService";

export default class UserLoginService implements IBaseService<Input, Output> {
  public async execute({ email, password, auth }: Input): Promise<Output> {
    const token = await auth.use("api").attempt(email, password, {
      expiresIn: ConfigurationValues.EMAIL_TOKEN_EXPIRATION,
    });

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
    messages: ValidatorHelper.getDefaultValidatorMessages,
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
