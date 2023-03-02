import { schema } from "@ioc:Adonis/Core/Validator";
import Bill from "App/Models/Bill";
import BaseService from "../BaseService";

export default class BillGetListService implements BaseService<Input, Output> {
  public async execute({
    userId,
    orderBy = "name",
    orderByDirection = "asc",
  }: Input): Promise<Output> {
    const bills = await Bill.query()
      .where("userId", userId)
      .orderBy(orderBy, orderByDirection as "asc" | "desc")
      .exec();

    return bills;
  }

  public schemaValidator = {
    schema: schema.create({
      orderBy: schema.enum.optional(["name", "dueDay"]),
      orderByDirection: schema.enum.optional(["asc", "desc"]),
    }),
  };
}

type Input = {
  userId: string;
  orderBy?: string;
  orderByDirection?: string;
};

type Output = Bill[];
