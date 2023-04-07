import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Payment from "App/Models/Payment";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import IBaseService from "../IBaseService";

export default class PaymentDeleteService
  implements IBaseService<Input, Output>
{
  public async execute({
    params: { paymentId },
    userId: _userId,
  }: Input): Promise<Output> {
    const payment = await Payment.find(paymentId);

    if (!payment) {
      throw new Error("Not found");
    }

    await payment.delete();
  }

  public schemaValidator = {
    schema: schema.create({
      params: schema.object().members({
        paymentId: schema.string({}, [rules.uuid({ version: 4 })]),
      }),
    }),
    messages: ValidatorHelper.getDefaultValidatorMessages,
  };
}

type Input = {
  userId: string;
  params: { paymentId: string };
};

type Output = void;
