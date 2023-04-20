import { schema } from "@ioc:Adonis/Core/Validator";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import { UserStatus } from "App/Constants/UserStatus";
import User from "App/Models/User";
import IBaseService from "../IBaseService";

export default class UserActiveService implements IBaseService<Input, Output> {
  public async execute({ userId }: Input): Promise<Output> {
    const user = await User.findOrFail(userId);

    if (![UserStatus.WAITING_CONFIRMATION].includes(user.status)) {
      throw new Error("User is in an invalid state to be activated!");
    }

    user.status = UserStatus.ACTIVE;
    await user.save();
  }

  public schemaValidator = {
    schema: schema.create({}),
    messages: DefaultValidatorMessages,
  };
}

type Input = {
  userId: string;
};

type Output = void;
