import { schema } from "@ioc:Adonis/Core/Validator";
import { UserStatus } from "App/Constants/UserStatus";
import User from "App/Models/User";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import IBaseService from "../IBaseService";

export default class UserActiveService implements IBaseService<Input, Output> {
  public async execute({ userId }: Input): Promise<Output> {
    const user = await User.findOrFail(userId);

    if (user.status !== UserStatus.WAITING_CONFIRMATION) {
      throw new Error("User is in an invalid state to be activated!");
    }

    user.status = UserStatus.ACTIVE;
    await user.save();
  }

  public schemaValidator = {
    schema: schema.create({}),
    messages: ValidatorHelper.getDefaultValidatorMessages,
  };
}

type Input = {
  userId: string;
};

type Output = void;
