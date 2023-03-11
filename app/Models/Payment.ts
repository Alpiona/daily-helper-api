import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public billId: string;

  @column()
  public description: string | null;

  @column()
  public value: number | null;

  @column()
  public referenceDate: DateTime;

  @column.dateTime()
  public paidAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public async update({ description, referenceDate, paidAt, value }) {
    if (!referenceDate) {
      throw new Error("One or more necessary params are empty");
    }

    this.description = description;
    this.referenceDate = referenceDate;
    this.paidAt = paidAt;
    this.value = value;
    await this.save();
  }
}
