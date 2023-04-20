import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
  });

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction();
  });

  group.tap((test) => test.tags(["user", "user-create"]));
};

test.group("Users - Create (Success) ", (group) => {
  setupGroupHooks(group);

  test("should create a user", async ({ client, route }) => {
    const requestBody = {
      email: "test@test.com",
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const response = await client
      .post(route("UsersController.create"))
      .json(requestBody);

    response.assertStatus(201);
    response.assertBody({ data: {}, errors: [] });
  });
});

test.group("Users - Create (Failed) ", (group) => {
  setupGroupHooks(group);

  test("should return error if email is invalid", async ({ client, route }) => {
    const requestBody = {
      email: "test",
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const response = await client
      .post(route("UsersController.create"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "The 'email' is in an invalid pattern" }],
    });
    response.assertStatus(422);
  });

  test("should return error if email is null", async ({ client, route }) => {
    const requestBody = {
      email: null,
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const apiReturn = await client
      .post(route("UsersController.create"))
      .json(requestBody);

    apiReturn.assertBodyContains({
      errors: [{ message: "The 'email' is required" }],
    });
    apiReturn.assertStatus(422);
  });

  test("should return error if email is already in use", async ({
    client,
    route,
  }) => {
    const user = await UserFactory.create();

    const requestBody = {
      email: user.email,
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const response = await client
      .post(route("UsersController.create"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "Email already in use" }],
    });
    response.assertStatus(409);
  });

  test("should return error if email is not send", async ({
    client,
    route,
  }) => {
    const requestBody = {
      password: "Password@123",
      passwordConfirmation: "Password@123",
    };

    const response = await client
      .post(route("UsersController.create"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "The 'email' is required" }],
    });
    response.assertStatus(422);
  });

  test("should return error if password is null", async ({ client, route }) => {
    const requestBody = {
      email: "test@test.com",
      password: null,
      passwordConfirmation: "Password@123",
    };

    const response = await client
      .post(route("UsersController.create"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "The 'password' is required" }],
    });
    response.assertStatus(422);
  });

  test("should return error if password is not send", async ({
    client,
    route,
  }) => {
    const requestBody = {
      email: "test@test.com",
      passwordConfirmation: "Password@123",
    };

    const response = await client
      .post(route("UsersController.create"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "The 'password' is required" }],
    });
    response.assertStatus(422);
  });

  test("should return error if passwordConfirmation is different", async ({
    client,
    route,
  }) => {
    const requestBody = {
      email: "test@test.com",
      password: "Password@123",
      passwordConfirmation: "Password@12",
    };

    const response = await client
      .post(route("UsersController.create"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "The 'passwordConfirmation' is incorrect" }],
    });
    response.assertStatus(422);
  });

  test("should return error if passwordConfirmation is not send", async ({
    client,
    route,
  }) => {
    const requestBody = {
      email: "test@test.com",
      password: "Password@123",
    };

    const response = await client
      .post(route("UsersController.create"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "The 'passwordConfirmation' is incorrect" }],
    });
    response.assertStatus(422);
  });
});
