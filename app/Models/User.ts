import Hash from "@ioc:Adonis/Core/Hash";
import { beforeSave, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import AppBaseModel from "./AppBaseModel";

export default class User extends AppBaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column()
  public status: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
