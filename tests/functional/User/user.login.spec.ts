import Database from "@ioc:Adonis/Lucid/Database";
import { Group, test } from "@japa/runner";
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
};

test.group("Users - Login (Success) ", (group) => {
  setupGroupHooks(group);
  test("should authenticate a user", async ({ client, route }) => {
    const response = await client
      .post(route("UsersController.login"))
      .json({ email: user.email, password });

    response.assertBodyContains({
      email: user.email,
      token: response.response.body.token,
    });
    response.assertStatus(200);
  });
});

test.group("Users - Login (Failed) ", (group) => {
  setupGroupHooks(group);

  test("should return error if email is wrong", async ({ client, route }) => {
    const response = await client
      .post(route("UsersController.login"))
      .json({ email: "user@email.com", password });

    response.assertTextIncludes("Invalid credentials");
    response.assertStatus(401);
  });

  test("should return error if email is invalid format", async ({
    client,
    route,
  }) => {
    const response = await client
      .post(route("UsersController.login"))
      .json({ email: "email.com", password });

    response.assertTextIncludes("The email is in an invalid pattern");
    response.assertStatus(422);
  });

  test("should return error if email is null", async ({ client, route }) => {
    const response = await client
      .post(route("UsersController.login"))
      .json({ email: null, password });

    response.assertBodyContains({
      errors: [{ message: "The email is required" }],
    });
    response.assertStatus(422);
  });

  test("should return error if email is not send", async ({
    client,
    route,
  }) => {
    const response = await client
      .post(route("UsersController.login"))
      .json({ password });

    response.assertBodyContains({
      errors: [{ message: "The email is required" }],
    });
    response.assertStatus(422);
  });

  test("should return error if password is wrong", async ({
    client,
    route,
  }) => {
    const response = await client
      .post(route("UsersController.login"))
      .json({ email: user.email, password: "password" });

    response.assertTextIncludes("Invalid credentials");
    response.assertStatus(401);
  });

  test("should return error if password is null", async ({ client, route }) => {
    const response = await client
      .post(route("UsersController.login"))
      .json({ email: user.email, password: null });

    response.assertBodyContains({
      errors: [{ message: "The password is required" }],
    });
    response.assertStatus(422);
  });

  test("should return error if password is not send", async ({
    client,
    route,
  }) => {
    const response = await client
      .post(route("UsersController.login"))
      .json({ email: user.email });

    response.assertBodyContains({
      errors: [{ message: "The password is required" }],
    });
    response.assertStatus(422);
  });
});
