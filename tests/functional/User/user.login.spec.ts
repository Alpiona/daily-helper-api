import Database from "@ioc:Adonis/Lucid/Database";
import { Group, test } from "@japa/runner";
import { UserStatus } from "App/Constants/UserStatus";
import User from "App/Models/User";
import { UserFactory } from "Database/factories";

const password = "Pass@123";
let user: User;

const setupGroupHooks = (group: Group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    user = await UserFactory.merge({ password }).create();

    return () => Database.rollbackGlobalTransaction();
  });

  group.tap((test) => test.tags(["user", "user-login"]));
};

test.group("Users - Login (Success) ", (group) => {
  setupGroupHooks(group);
  test("should authenticate a user", async ({ client, route, assert }) => {
    const requestBody = { email: user.email, password };

    const response = await client
      .post(route("UsersController.login"))
      .json(requestBody);

    const { data } = response.body();

    response.assertStatus(200);

    response.assertBodyContains({
      data: {
        email: user.email,
        token: data.token,
        expiresAt: data.expiresAt,
      },
    });

    assert.isNotFalse(data.token);
    assert.isNotFalse(data.expiresAt);
  });
});

test.group("Users - Login (Failed) ", (group) => {
  setupGroupHooks(group);

  test("should return error if email is wrong", async ({ client, route }) => {
    const requestBody = { email: "user@email.com", password };

    const response = await client
      .post(route("UsersController.login"))
      .json(requestBody);

    response.assertTextIncludes("Invalid credentials");
    response.assertStatus(401);
  });

  test("should return error if email is invalid format", async ({
    client,
    route,
  }) => {
    const requestBody = { email: "email.com", password };

    const response = await client
      .post(route("UsersController.login"))
      .json(requestBody);

    response.assertTextIncludes("The 'email' is in an invalid pattern");
    response.assertStatus(422);
  });

  test("should return error if email is null", async ({ client, route }) => {
    const requestBody = { email: null, password };

    const response = await client
      .post(route("UsersController.login"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "The 'email' is required" }],
    });
    response.assertStatus(422);
  });

  test("should return error if email is not send", async ({
    client,
    route,
  }) => {
    const requestBody = { password };

    const response = await client
      .post(route("UsersController.login"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "The 'email' is required" }],
    });
    response.assertStatus(422);
  });

  test("should return error if password is wrong", async ({
    client,
    route,
  }) => {
    const requestBody = { email: user.email, password: "password" };

    const response = await client
      .post(route("UsersController.login"))
      .json(requestBody);

    response.assertTextIncludes("Invalid credentials");
    response.assertStatus(401);
  });

  test("should return error if password is null", async ({ client, route }) => {
    const requestBody = { email: user.email, password: null };

    const response = await client
      .post(route("UsersController.login"))
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
    const requestBody = { email: user.email };

    const response = await client
      .post(route("UsersController.login"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [{ message: "The 'password' is required" }],
    });
    response.assertStatus(422);
  });

  test("should return error if user is not with status ACTIVE", async ({
    client,
    route,
  }) => {
    const anotherUser = await UserFactory.merge({
      password,
      status: UserStatus.WAITING_CONFIRMATION,
    }).create();

    const requestBody = { email: anotherUser.email, password };

    const response = await client
      .post(route("UsersController.login"))
      .json(requestBody);

    response.assertBodyContains({
      errors: [
        { message: "User is not active, please enter in contact with support" },
      ],
    });
    response.assertStatus(401);
  });
});
