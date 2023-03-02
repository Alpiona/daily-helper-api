import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public billId: string;

  @column()
  public description: string | null;

  @column()
  public value: number | null;

  @column.dateTime()
  public paidAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
