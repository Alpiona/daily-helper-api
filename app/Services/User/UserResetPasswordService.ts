import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import IBaseService from "../IBaseService";

export default class UserResetPasswordService
  implements IBaseService<Input, Output>
{
  public async execute({ password, auth }: Input): Promise<Output> {
    const { user } = auth;

    if (!user) {
      throw new Error("User not found!");
    }

    user.password = password;
    await user.save();
  }

  public schemaValidator = {
    schema: schema.create({
      password: schema.string({}, [
        rules.minLength(6),
        rules.confirmed("passwordConfirmation"),
      ]),
    }),
    messages: DefaultValidatorMessages,
  };
}

type Input = {
  password: string;
  auth: AuthContract;
};

type Output = void;
