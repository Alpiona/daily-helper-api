import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import User from "./User";

export default class Bill extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public description: string | null;

  @column({ serializeAs: null })
  public userId: string;

  @column()
  public dueDay: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  public async update({ name, dueDay, description }) {
    if (!name) {
      throw new Error("One or more necessary params are empty");
    }

    this.name = name;
    this.dueDay = dueDay;
    this.description = description;
    await this.save();
  }
}
