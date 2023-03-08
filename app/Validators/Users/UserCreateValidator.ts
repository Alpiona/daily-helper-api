import { rules, schema } from "@ioc:Adonis/Core/Validator";
import BaseValidator from "../BaseValidator";

export default class UserCreateValidator extends BaseValidator {
  protected serviceSchema() {
    return {
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [
        rules.minLength(6),
        rules.confirmed("passwordConfirmation"),
      ]),
    };
  }
}
