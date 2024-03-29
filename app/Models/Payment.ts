import { BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import AppBaseModel from "./AppBaseModel";
import Bill from "./Bill";

export default class Payment extends AppBaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public billId: string;

  @belongsTo(() => Bill)
  public bill: BelongsTo<typeof Bill>;

  @column()
  public value: number | null;

  @column.dateTime()
  public referenceDate: DateTime;

  @column.dateTime()
  public paidAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public async update({ referenceDate, paidAt, value }) {
    if (!referenceDate) {
      throw new Error("One or more necessary params are empty");
    }

    this.referenceDate = referenceDate;
    this.paidAt = paidAt;
    this.value = value;
    await this.save();
  }
}
