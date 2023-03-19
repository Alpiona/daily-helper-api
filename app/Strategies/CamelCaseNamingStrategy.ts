import { string } from "@ioc:Adonis/Core/Helpers";
import { LucidModel, SnakeCaseNamingStrategy } from "@ioc:Adonis/Lucid/Orm";

export default class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public serializedName(_model: LucidModel, attributeName: string): string {
    return string.camelCase(attributeName);
  }
}
