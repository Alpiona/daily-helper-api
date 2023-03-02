import {
  ParsedTypedSchema,
  RequestValidatorNode,
  TypedSchema,
} from "@ioc:Adonis/Core/Validator";

export interface BaseService<Input, Output> {
  execute(input: Input): Promise<Output>;
  schemaValidator: RequestValidatorNode<ParsedTypedSchema<TypedSchema>>;
}

export default BaseService;
