import {
  ParsedTypedSchema,
  RequestValidatorNode,
  TypedSchema,
} from "@ioc:Adonis/Core/Validator";

export default interface IBaseService<Input, Output> {
  execute(input: Input): Promise<Output>;
  schemaValidator: RequestValidatorNode<ParsedTypedSchema<TypedSchema>>;
}
