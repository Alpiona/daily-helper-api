export namespace ValidatorHelper {
  export const getDefaultValidatorMessages = {
    required: "The '{{ field }}' is required",
    email: "The '{{ field }}' is in an invalid pattern",
    uuid: "The '{{ field }}' need to be UUID type",
    confirmed: "The '{{ field }}' is incorrect",
    enum: "The '{{ field }}' only accepts the values [{{ options.choices }}]",
  };
}
