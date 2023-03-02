// import Database from "@ioc:Adonis/Lucid/Database";
// import { test } from "@japa/runner";
// import { UserFactory } from "Database/factories";

// const endpointUrl = "/bills";
// const password = "Pass@123";
// let token;

// const setupGroupHooks = (group) => {
//   group.each.setup(async () => {
//     await Database.beginGlobalTransaction();
//     const user = await UserFactory.merge({ password }).create();
//   });

//   group.each.teardown(async () => {
//     await Database.rollbackGlobalTransaction();
//   });
// };

// test.group("Bills - Create (Success) ", (group) => {
//   setupGroupHooks(group);

//   test("should create a user", async ({ client }) => {
//     const body = {
//       email: "test@test.com",
//       password: "Password@123",
//       passwordConfirmation: "Password@123",
//     };

//     const apiReturn = await client.post(endpointUrl).json(body);

//     apiReturn.assertStatus(201);
//   });
// });
