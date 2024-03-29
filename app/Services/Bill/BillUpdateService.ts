import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import Bill from "App/Models/Bill";
import IBaseService from "../IBaseService";

export default class BillUpdateService implements IBaseService<Input, Output> {
  public async execute({
    dueDay,
    name,
    description,
    userId,
    params: { billId },
  }: Input): Promise<Output> {
    const bill = await Bill.query()
      .where("userId", userId)
      .andWhere("id", billId)
      .firstOrFail();

    await bill.update({ dueDay, name, description });
  }

  public schemaValidator = {
    schema: schema.create({
      name: schema.string({}, [rules.minLength(3)]),
      description: schema.string.optional({}, [rules.minLength(3)]),
      dueDay: schema.number.optional([rules.range(1, 31)]),
      params: schema
        .object()
        .members({ billId: schema.string({}, [rules.uuid({ version: 4 })]) }),
    }),
    messages: DefaultValidatorMessages,
  };
}

type Input = {
  userId: string;
  name: string;
  description?: string;
  dueDay?: number;
  params: { billId: string };
};

type Output = void;
