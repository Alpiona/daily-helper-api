import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import Payment from "App/Models/Payment";
import IBaseService from "../IBaseService";

export default class PaymentGetListService
  implements IBaseService<Input, Output>
{
  public async execute({
    billId,
    orderBy = "referenceDate",
    orderByDirection = "desc",
  }: Input): Promise<Output> {
    const payments = await Payment.query()
      .where("billId", billId)
      .orderBy(orderBy, orderByDirection as "asc" | "desc");

    return payments;
  }

  public schemaValidator = {
    schema: schema.create({
      orderBy: schema.enum.optional(["name", "dueDay"]),
      orderByDirection: schema.enum.optional(["asc", "desc"]),
      billId: schema.string({}, [rules.uuid({ version: 4 })]),
    }),
    messages: DefaultValidatorMessages,
  };
}

type Input = {
  billId: string;
  orderBy?: string;
  orderByDirection?: string;
};

type Output = Payment[];
