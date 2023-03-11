import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";

const endpointUrl = "/users";

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
  });

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction();
  });
};

test.group("Users - Create (Success) ", (group) => {
  setupGroupHooks(group);

  test("should create a user", async ({ client }) => {
    const body = {
      email: "test@test.com",
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const apiReturn = await client.post(endpointUrl).json(body);

    apiReturn.assertStatus(201);
  });
});

test.group("Users - Create (Failed) ", (group) => {
  setupGroupHooks(group);

  test("should return error if email is invalid", async ({ client }) => {
    const body = {
      email: "test",
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const apiReturn = await client.post(endpointUrl).json(body);

    apiReturn.assertBodyContains({
      errors: [{ message: "The email is in an invalid pattern" }],
    });
    apiReturn.assertStatus(422);
  });

  test("should return error if email is null", async ({ client }) => {
    const body = {
      email: null,
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const apiReturn = await client.post(endpointUrl).json(body);

    apiReturn.assertBodyContains({
      errors: [{ message: "The email is required" }],
    });
    apiReturn.assertStatus(422);
  });

  test("should return error if email is already in use", async ({ client }) => {
    const user = await UserFactory.create();

    const body = {
      email: user.email,
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const apiReturn = await client.post(endpointUrl).json(body);

    apiReturn.assertBodyContains({
      errors: [{ message: "Email already in use" }],
    });
    apiReturn.assertStatus(409);
  });

  test("should return error if email is not send", async ({ client }) => {
    const body = {
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const apiReturn = await client.post(endpointUrl).json(body);

    apiReturn.assertBodyContains({
      errors: [{ message: "The email is required" }],
    });
    apiReturn.assertStatus(422);
  });

  test("should return error if password is null", async ({ client }) => {
    const body = {
      email: "test@test.com",
      password: null,
      passwordConfirmation: "Password@123",
    };

    const apiReturn = await client.post(endpointUrl).json(body);

    apiReturn.assertBodyContains({
      errors: [{ message: "The password is required" }],
    });
    apiReturn.assertStatus(422);
  });

  test("should return error if password is not send", async ({ client }) => {
    const body = {
      email: "test@test.com",
      passwordConfirmation: "Password@123",
    };

    const apiReturn = await client.post(endpointUrl).json(body);

    apiReturn.assertBodyContains({
      errors: [{ message: "The password is required" }],
    });
    apiReturn.assertStatus(422);
  });

  test("should return error if passwordConfirmation is different", async ({
    client,
  }) => {
    const body = {
      email: "test@test.com",
      password: "Password@123",
      passwordConfirmation: "Password@12",
    };

    const apiReturn = await client.post(endpointUrl).json(body);

    apiReturn.assertBodyContains({
      errors: [{ message: "The passwordConfirmation is incorrect" }],
    });
    apiReturn.assertStatus(422);
  });

  test("should return error if passwordConfirmation is not send", async ({
    client,
  }) => {
    const body = {
      email: "test@test.com",
      password: "Password@123",
    };

    const apiReturn = await client.post(endpointUrl).json(body);

    apiReturn.assertBodyContains({
      errors: [{ message: "The passwordConfirmation is incorrect" }],
    });
    apiReturn.assertStatus(422);
  });
});
