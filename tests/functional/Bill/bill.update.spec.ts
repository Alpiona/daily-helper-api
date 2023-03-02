import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import Bill from "App/Models/Bill";
import User from "App/Models/User";
import { BillFactory, UserFactory } from "Database/factories";

let user: User;
let bill: Bill;
let newBillParams: Bill;

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    user = await UserFactory.create();
    bill = await BillFactory.merge({ userId: user.id }).create();
    newBillParams = await BillFactory.make();

    return () => Database.rollbackGlobalTransaction();
  });
};

test.group("Bills - Update (Success) ", (group) => {
  setupGroupHooks(group);

  test("should update a bill with just necessary params", async ({
    client,
    route,
    assert,
  }) => {
    const body = {
      name: newBillParams.name,
    };

    assert.notEqual(bill.name, newBillParams.name);

    const response = await client
      .put(route("BillsController.update", { billId: bill.id }))
      .json(body)
      .loginAs(user);

    response.assertStatus(200);

    await bill.refresh();

    assert.equal(bill.name, newBillParams.name);
  });

  test("should update a bill with optional params", async ({
    client,
    route,
    assert,
  }) => {
    const body = {
      name: newBillParams.name,
      dueDay: newBillParams.dueDay,
      description: newBillParams.description,
    };

    assert.notEqual(bill.description, newBillParams.description);
    assert.notEqual(bill.dueDay, newBillParams.dueDay);

    const response = await client
      .put(route("BillsController.update", { billId: bill.id }))
      .json(body)
      .loginAs(user);

    response.assertStatus(200);

    await bill.refresh();

    assert.equal(bill.description, newBillParams.description);
    assert.equal(bill.dueDay, newBillParams.dueDay);
  });
});

test.group("Bills - Update (Failure) ", (group) => {
  setupGroupHooks(group);

  test("should return error with non-existent bill ", async ({
    client,
    route,
  }) => {
    const body = {
      name: bill.name,
      dueDay: bill.dueDay,
    };

    const response = await client
      .put(route("BillsController.update", { billId: user.id }))
      .json(body)
      .loginAs(user);

    response.assertStatus(404);
    response.assertBodyContains({
      errors: [{ message: "Resource not found" }],
    });
  });

  test("should return error with wrong user", async ({ client, route }) => {
    const wrongUser = await UserFactory.create();

    const body = {
      name: bill.name,
      dueDay: bill.dueDay,
    };

    const response = await client
      .put(route("BillsController.update", { billId: bill.id }))
      .json(body)
      .loginAs(wrongUser);

    response.assertStatus(404);
    response.assertBodyContains({
      errors: [{ message: "Resource not found" }],
    });
  });

  test("should return error without authentication", async ({
    client,
    route,
  }) => {
    const body = {
      name: bill.name,
      dueDay: bill.dueDay,
    };

    const response = await client
      .put(route("BillsController.update", { billId: bill.id }))
      .json(body);

    response.assertStatus(401);
    response.assertBodyContains({
      errors: [{ message: "Access unauthorized" }],
    });
  });
});
