import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Bill from "App/Models/Bill";
import BaseService from "../BaseService";

export default class BillCreateService implements BaseService<Input, Output> {
  public async execute(input: Input): Promise<Output> {
    const bill = await Bill.create(input);

    return bill;
  }

  public schemaValidator = {
    schema: schema.create({
      name: schema.string({}, [rules.minLength(3)]),
      description: schema.string.optional({}, [rules.minLength(3)]),
      dueDay: schema.number.optional([rules.range(1, 31)]),
    }),
  };
}

type Input = {
  userId: string;
  name: string;
  description?: string;
  dueDay?: number;
};

type Output = Bill;
