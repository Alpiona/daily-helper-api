import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Payment from "App/Models/Payment";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import { DateTime } from "luxon";
import IBaseService from "../IBaseService";

export default class PaymentCreateService
  implements IBaseService<Input, Output>
{
  public async execute(input: Input): Promise<Output> {
    const payment = await Payment.create(input);

    return payment;
  }

  public schemaValidator = {
    schema: schema.create({
      billId: schema.string({}, [rules.uuid({ version: 4 })]),
      description: schema.string.optional({}, [rules.minLength(3)]),
      paidAt: schema.date.optional(),
      referenceDate: schema.date(),
      value: schema.number.optional(),
    }),
    messages: ValidatorHelper.getDefaultValidatorMessages,
  };
}

type Input = {
  billId: string;
  description?: string;
  paidAt?: DateTime;
  referenceDate: DateTime;
  value?: number;
  userId: string;
};

type Output = Payment;