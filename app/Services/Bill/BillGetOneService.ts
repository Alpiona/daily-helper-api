import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Bill from "App/Models/Bill";
import BaseService from "../BaseService";

export default class BillGetOneService implements BaseService<Input, Output> {
  public async execute({ userId, params: { billId } }: Input): Promise<Output> {
    const bill = await Bill.query()
      .where("userId", userId)
      .andWhere("id", billId)
      .firstOrFail();

    return bill;
  }

  public schemaValidator = {
    schema: schema.create({
      params: schema
        .object()
        .members({ billId: schema.string({}, [rules.uuid({ version: 4 })]) }),
    }),
  };
}

type Input = {
  userId: string;
  params: { billId: string };
};

type Output = Bill;
