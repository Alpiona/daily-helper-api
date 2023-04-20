import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import Payment from "App/Models/Payment";
import IBaseService from "../IBaseService";

export default class PaymentGetOneService
  implements IBaseService<Input, Output>
{
  public async execute({
    userId,
    params: { paymentId },
  }: Input): Promise<Output> {
    const payment = await Payment.query()
      .where("userId", userId)
      .andWhere("id", paymentId)
      .firstOrFail();

    return payment;
  }

  public schemaValidator = {
    schema: schema.create({
      params: schema.object().members({
        paymentId: schema.string({}, [rules.uuid({ version: 4 })]),
      }),
    }),
    messages: {
      ...DefaultValidatorMessages,
      "params.paymentId.uuid": "The payment ID need to be UUID type",
    },
  };
}

type Input = {
  userId: string;
  params: { paymentId: string };
};

type Output = Payment;
