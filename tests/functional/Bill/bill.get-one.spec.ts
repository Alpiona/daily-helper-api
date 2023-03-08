import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import Bill from "App/Models/Bill";
import User from "App/Models/User";
import { BillFactory, UserFactory } from "Database/factories";

let user: User;
let bill: Bill;

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    user = await UserFactory.create();
    bill = await BillFactory.merge({ userId: user.id }).create();

    return () => Database.rollbackGlobalTransaction();
  });
};

test.group("Bills - Get One (Success) ", (group) => {
  setupGroupHooks(group);

  test("should get the bill", async ({ client, route }) => {
    const response = await client
      .get(route("BillsController.getOne", { billId: bill.id }))
      .loginAs(user);

    response.assertStatus(200);
    response.assertBodyContains({ data: bill.toJSON() });
  });
});

test.group("Bills - Get One (Failure) ", (group) => {
  setupGroupHooks(group);

  test("should return error if bill does not exist", async ({
    client,
    route,
  }) => {
    const response = await client
      .get(route("BillsController.getOne", { billId: user.id }))
      .loginAs(user);

    response.assertStatus(404);
    response.assertBodyContains({
      errors: [{ message: "Resource not found" }],
    });
  });

  test("should return error if bill does not belong to user", async ({
    client,
    route,
  }) => {
    const anotherUser = await UserFactory.create();
    const anotherBill = await BillFactory.merge({
      userId: anotherUser.id,
    }).create();

    const response = await client
      .get(route("BillsController.getOne", { billId: anotherBill.id }))
      .loginAs(user);

    response.assertStatus(404);
    response.assertBodyContains({
      errors: [{ message: "Resource not found" }],
    });
  });

  test("should return error if it has not sent the token", async ({
    client,
    route,
  }) => {
    const response = await client.get(
      route("BillsController.getOne", { billId: bill.id })
    );

    response.assertStatus(401);
    response.assertBodyContains({
      errors: [{ message: "Access unauthorized" }],
    });
  });

  test("should return validator error if billId is not UUID", async ({
    client,
    route,
  }) => {
    const response = await client
      .get(route("BillsController.getOne", { billId: 123456 }))
      .loginAs(user);

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [{ message: "The bill ID need to be UUID type" }],
    });
  });
});
