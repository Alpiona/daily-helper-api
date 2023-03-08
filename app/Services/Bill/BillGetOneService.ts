import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Bill from "App/Models/Bill";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import IBaseService from "../IBaseService";

export default class BillGetOneService implements IBaseService<Input, Output> {
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
    messages: {
      ...ValidatorHelper.getDefaultValidatorMessages,
      "params.billId.uuid": "The bill ID need to be UUID type",
    },
  };
}

type Input = {
  userId: string;
  params: { billId: string };
};

type Output = Bill;
