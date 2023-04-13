import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { UserStatus } from "App/Constants/UserStatus";
import User from "App/Models/User";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import IBaseService from "../IBaseService";

export default class UserCreateService implements IBaseService<Input, Output> {
  public async execute({ email, password }: Input): Promise<Output> {
    try {
      await User.create({
        email,
        password,
        status: UserStatus.WAITING_CONFIRMATION,
      });
    } catch (err) {
      if (err.constraint === "users_email_unique") {
        throw new Error("Email already in use");
      }
    }
  }

  public schemaValidator = {
    schema: schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [
        rules.minLength(6),
        rules.confirmed("passwordConfirmation"),
      ]),
    }),
    messages: ValidatorHelper.getDefaultValidatorMessages,
  };
}

type Input = {
  email: string;
  password: string;
};

type Output = void;
