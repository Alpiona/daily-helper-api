import { RequestContract } from "@ioc:Adonis/Core/Request";
import Bill from "App/Models/Bill";
import BillDeleteValidator from "App/Validators/Bills/BillDeleteValidator";
import BaseService from "../BaseService";

export default class BillDeleteService implements BaseService<Input, Output> {
  public async execute({ billId, userId }: Input): Promise<Output> {
    const bill = await Bill.query()
      .where("userId", userId)
      .andWhere("billId", billId)
      .first();

    if (!bill) {
      throw new Error("Not found");
    }

    await bill.delete();
  }

  public async validate(request: RequestContract): Promise<Input> {
    return await request.validate(BillDeleteValidator);
  }
}

type Input = {
  userId: string;
  billId: string;
};

type Output = void;
