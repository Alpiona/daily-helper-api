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
    const apiReturn = await client
      .post(route("UsersController.login"))
      .json({ email: user.email, password });

    apiReturn.assertBodyContains({
      email: user.email,
      token: apiReturn.response.body.token,
    });
    apiReturn.assertStatus(200);
  });
});

test.group("Users - Login (Failed) ", (group) => {
  setupGroupHooks(group);

  test("should return error if email is wrong", async ({ client }) => {
    const apiReturn = await client
      .post("/users/login")
      .json({ email: "user@email.com", password });

    apiReturn.assertTextIncludes("Invalid credentials");
    apiReturn.assertStatus(401);
  });

  test("should return error if email is null", async ({ client }) => {
    const response = await client
      .post("/users/login")
      .json({ email: null, password });

    response.assertBodyContains({
      errors: [
        {
          field: "email",
          message: "required validation failed",
          rule: "required",
        },
      ],
    });
    response.assertStatus(422);
  });

  test("should return error if email is not send", async ({ client }) => {
    const response = await client.post("/users/login").json({ password });

    response.assertBodyContains({
      errors: [
        {
          field: "email",
          message: "required validation failed",
          rule: "required",
        },
      ],
    });
    response.assertStatus(422);
  });

  test("should return error if password is wrong", async ({ client }) => {
    const apiReturn = await client
      .post("/users/login")
      .json({ email: user.email, password: "password" });

    apiReturn.assertTextIncludes("Invalid credentials");
    apiReturn.assertStatus(401);
  });

  test("should return error if password is null", async ({ client }) => {
    const response = await client
      .post("/users/login")
      .json({ email: user.email, password: null });

    response.assertBodyContains({
      errors: [
        {
          field: "password",
          message: "required validation failed",
          rule: "required",
        },
      ],
    });
    response.assertStatus(422);
  });

  test("should return error if password is not send", async ({ client }) => {
    const response = await client
      .post("/users/login")
      .json({ email: user.email });

    response.assertBodyContains({
      errors: [
        {
          field: "password",
          message: "required validation failed",
          rule: "required",
        },
      ],
    });
    response.assertStatus(422);
  });
});
