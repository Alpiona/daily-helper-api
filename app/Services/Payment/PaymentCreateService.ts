import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import Payment from "App/Models/Payment";
import { DateTime } from "luxon";
import IBaseService from "../IBaseService";

export default class PaymentCreateService
  implements IBaseService<Input, Output>
{
  public async execute(input: Input, _userId: string): Promise<Output> {
    const payment = await Payment.create(input);

    return payment;
  }

  public schemaValidator = {
    schema: schema.create({
      billId: schema.string({}, [rules.uuid({ version: 4 })]),
      paidAt: schema.date.optional(),
      referenceDate: schema.date(),
      value: schema.number.optional(),
    }),
    messages: DefaultValidatorMessages,
  };
}

type Input = {
  billId: string;
  paidAt?: DateTime;
  referenceDate: DateTime;
  value?: number;
};

type Output = Payment;
