import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { DefaultValidatorMessages } from "App/Constants/DefaultValidatorMessages";
import Bill from "App/Models/Bill";
import IBaseService from "../IBaseService";

export default class BillDeleteService implements IBaseService<Input, Output> {
  public async execute({ params: { billId }, userId }: Input): Promise<Output> {
    const bill = await Bill.query()
      .where("userId", userId)
      .andWhere("billId", billId)
      .first();

    if (!bill) {
      throw new Error("Not found");
    }

    await bill.delete();
  }

  public schemaValidator = {
    schema: schema.create({
      params: schema
        .object()
        .members({ billId: schema.string({}, [rules.uuid({ version: 4 })]) }),
    }),
    messages: DefaultValidatorMessages,
  };
}

type Input = {
  userId: string;
  params: { billId: string };
};

type Output = void;
