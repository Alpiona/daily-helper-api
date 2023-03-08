import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import Bill from "App/Models/Bill";
import User from "App/Models/User";
import { BillFactory, UserFactory } from "Database/factories";

let user: User;
let bills: Bill[];

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    user = await UserFactory.create();
    bills = await BillFactory.merge({ userId: user.id }).createMany(5);

    return () => Database.rollbackGlobalTransaction();
  });
};

test.group("Bills - Get List (Success)", (group) => {
  setupGroupHooks(group);

  test("should return user bills list", async ({ client, route }) => {
    const response = await client
      .get(route("BillsController.getList"))
      .loginAs(user);

    response.assertStatus(200);
    response.assertBodyContains({ data: bills.map((b) => b.toJSON()) });
  });

  test("should return user bills list ordered by name asc as default", async ({
    client,
    route,
    assert,
  }) => {
    const billsOrdered = bills
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((b) => b.toJSON());

    const response = await client
      .get(route("BillsController.getList"))
      .loginAs(user);

    assert.deepEqual(response.body().data, billsOrdered);
  });

  test("should return user bills list ordered by name desc", async ({
    client,
    route,
    assert,
  }) => {
    const billsOrdered = bills
      .sort((a, b) => b.name.localeCompare(a.name))
      .map((b) => b.toJSON());

    const response = await client
      .get(route("BillsController.getList"))
      .qs("orderByDirection", "desc")
      .loginAs(user);

    assert.deepEqual(response.body().data, billsOrdered);
  });

  test("should return user bills list ordered by dueDay asc", async ({
    client,
    route,
    assert,
  }) => {
    const billsOrdered = bills
      .sort((a, b) => a.dueDay - b.dueDay)
      .map((b) => b.toJSON());

    const response = await client
      .get(route("BillsController.getList"))
      .qs("orderBy", "dueDay")
      .loginAs(user);

    assert.deepEqual(response.body().data, billsOrdered);
  });

  test("should return user bills list ordered by dueDay desc", async ({
    client,
    route,
    assert,
  }) => {
    const billsOrdered = bills
      .sort((a, b) => b.dueDay - a.dueDay)
      .map((b) => b.toJSON());

    const response = await client
      .get(route("BillsController.getList"))
      .qs({ orderBy: "dueDay", orderByDirection: "desc" })
      .loginAs(user);

    assert.deepEqual(response.body().data, billsOrdered);
  });

  test("should return empty without any bill", async ({ client, route }) => {
    const anotherUser = await UserFactory.create();

    const response = await client
      .get(route("BillsController.getList"))
      .loginAs(anotherUser);

    response.assertStatus(200);
    response.assertBodyContains({
      data: [],
    });
  });
});

test.group("Bills - Get List (Failure)", (group) => {
  setupGroupHooks(group);

  test("should return error without authentication", async ({
    client,
    route,
  }) => {
    const response = await client.get(route("BillsController.getList"));

    response.assertStatus(401);
    response.assertBodyContains({
      errors: [{ message: "Access unauthorized" }],
    });
  });

  test("should return error with invalid orderBy", async ({
    client,
    route,
  }) => {
    const anotherUser = await UserFactory.create();

    const response = await client
      .get(route("BillsController.getList"))
      .qs({ orderBy: "invalid" })
      .loginAs(anotherUser);

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [
        { message: "The 'orderBy' only accepts the values [name,dueDay]" },
      ],
    });
  });

  test("should return error with invalid orderByDirection", async ({
    client,
    route,
  }) => {
    const anotherUser = await UserFactory.create();

    const response = await client
      .get(route("BillsController.getList"))
      .qs({ orderByDirection: "invalid" })
      .loginAs(anotherUser);

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [
        {
          message: "The 'orderByDirection' only accepts the values [asc,desc]",
        },
      ],
    });
  });
});
