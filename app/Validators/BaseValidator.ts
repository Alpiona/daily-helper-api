import {
  CustomMessages,
  ParsedTypedSchema,
  RequestValidatorNode,
  schema,
  TypedSchema,
} from "@ioc:Adonis/Core/Validator";

export default class BaseValidator {
  protected customMessages(): CustomMessages | void {}

  protected serviceSchema(): TypedSchema {
    return {};
  }

  public getValidatorSchema(): RequestValidatorNode<
    ParsedTypedSchema<TypedSchema>
  > {
    return {
      schema: this.schema,
      messages: this.messages,
    };
  }

  public schema = schema.create(this.serviceSchema());

  public messages: CustomMessages = {
    required: "The {{ field }} is required",
    email: "The {{ field }} is in an invalid pattern",
    uuid: "The {{ field }}' need to be UUID type",
    confirmed: "The {{ field }} is incorrect",
    enum: "The {{ field }} only accepts the values [{{ options.choices }}]",
    minLength:
      "The {{ field }} must have at least {{ options.minLength }} characters",
    maxLength:
      "The {{ field }} must have at most {{ options.maxLength }} characters",
    ...this.customMessages(),
  };
}
