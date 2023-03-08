import { rules, schema } from "@ioc:Adonis/Core/Validator";
import BaseValidator from "../BaseValidator";

export default class UserLoginValidator extends BaseValidator {
  protected serviceSchema() {
    return {
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.minLength(6)]),
    };
  }
}
