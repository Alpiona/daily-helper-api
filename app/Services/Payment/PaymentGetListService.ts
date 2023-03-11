import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Payment from "App/Models/Payment";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import IBaseService from "../IBaseService";

export default class PaymentGetListService
  implements IBaseService<Input, Output>
{
  public async execute({
    userId,
    billId,
    orderBy = "name",
    orderByDirection = "asc",
  }: Input): Promise<Output> {
    const payments = await Payment.query()
      .where("userId", userId)
      .andWhere("billId", billId)
      .orderBy(orderBy, orderByDirection as "asc" | "desc");

    return payments;
  }

  public schemaValidator = {
    schema: schema.create({
      orderBy: schema.enum.optional(["name", "dueDay"]),
      orderByDirection: schema.enum.optional(["asc", "desc"]),
      billId: schema.string({}, [rules.uuid({ version: 4 })]),
    }),
    messages: ValidatorHelper.getDefaultValidatorMessages,
  };
}

type Input = {
  userId: string;
  billId: string;
  orderBy?: string;
  orderByDirection?: string;
};

type Output = Payment[];
