import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Payment from "App/Models/Payment";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import { DateTime } from "luxon";
import IBaseService from "../IBaseService";

export default class PaymentUpdateService
  implements IBaseService<Input, Output>
{
  public async execute({
    description,
    paidAt,
    referenceDate,
    value,
    params: { paymentId },
  }: Input): Promise<Output> {
    const payment = await Payment.query().where("id", paymentId).firstOrFail();

    await payment.update({ description, paidAt, referenceDate, value });
  }

  public schemaValidator = {
    schema: schema.create({
      description: schema.string.optional({}, [rules.minLength(3)]),
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
  description?: string;
  paidAt?: DateTime;
  referenceDate: DateTime;
  value?: number;
  userId: string;
  params: { paymentId: string };
};

type Output = void;
