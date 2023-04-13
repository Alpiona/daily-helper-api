import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Payment from "App/Models/Payment";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import { DateTime } from "luxon";
import IBaseService from "../IBaseService";

export default class PaymentUpdateService
  implements IBaseService<Input, Output>
{
  public async execute({
    paidAt,
    referenceDate,
    value,
    params: { paymentId },
  }: Input): Promise<Output> {
    const payment = await Payment.findOrFail(paymentId);

    await payment.update({ paidAt, referenceDate, value });
  }

  public schemaValidator = {
    schema: schema.create({
      paidAt: schema.date.optional(),
      referenceDate: schema.date(),
      value: schema.number.optional(),
      params: schema.object().members({
        paymentId: schema.string({}, [rules.uuid({ version: 4 })]),
      }),
    }),
    messages: ValidatorHelper.getDefaultValidatorMessages,
  };
}

type Input = {
  paidAt?: DateTime;
  referenceDate: DateTime;
  value?: number;
  userId: string;
  params: { paymentId: string };
};

type Output = void;
