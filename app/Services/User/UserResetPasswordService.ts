import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
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
    messages: ValidatorHelper.getDefaultValidatorMessages,
  };
}

type Input = {
  password: string;
  auth: AuthContract;
};

type Output = void;
