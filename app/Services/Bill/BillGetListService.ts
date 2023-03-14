import { schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import Bill from "App/Models/Bill";
import { ValidatorHelper } from "App/Utils/ValidatorHelper";
import { DateTime } from "luxon";
import IBaseService from "../IBaseService";

export default class BillGetListService implements IBaseService<Input, Output> {
  public async execute({
    userId,
    orderBy = "name",
    orderByDirection = "asc",
  }: Input): Promise<Output> {
    const actualMonthDate = DateTime.utc().startOf("month");

    const bills = await Bill.query()
      .select("*")
      .select(
        Database.from("payments")
          .select(
            Database.raw("reference_date >= ?", [actualMonthDate.toISO()]).wrap(
              "(",
              ")"
            )
          )
          .whereColumn("payments.bill_id", "bills.id")
          .limit(1)
          .as("month_paid")
      )
      .where("userId", userId)
      .orderBy(orderBy, orderByDirection as "asc" | "desc");

    return bills;
  }

  public schemaValidator = {
    schema: schema.create({
      orderBy: schema.enum.optional(["name", "dueDay"]),
      orderByDirection: schema.enum.optional(["asc", "desc"]),
    }),
    messages: ValidatorHelper.getDefaultValidatorMessages,
  };
}

type Input = {
  userId: string;
  orderBy?: string;
  orderByDirection?: string;
};

type Output = Bill[];
