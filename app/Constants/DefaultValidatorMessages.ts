export const DefaultValidatorMessages = {
  required: "The '{{ field }}' is required",
  email: "The '{{ field }}' is in an invalid pattern",
  uuid: "The '{{ field }}' need to be UUID type",
  confirmed: "The '{{ field }}' is incorrect",
  minLength:
    "The '{{ field }}' need to have at least {{ options.minLength }} characters",
  enum: "The '{{ field }}' only accepts the values [{{ options.choices }}]",
};
