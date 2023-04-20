import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import Bill from "App/Models/Bill";
import User from "App/Models/User";
import { BillFactory, UserFactory } from "Database/factories";

let user: User;
let billAttributes: Bill;

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    user = await UserFactory.create();
    billAttributes = await BillFactory.make();

    return () => Database.rollbackGlobalTransaction();
  });

  group.tap((test) => test.tags(["bill", "create"]));
};

test.group("Bills - Create (Success) ", (group) => {
  setupGroupHooks(group);

  test("should create with just necessary params", async ({
    client,
    route,
    assert,
  }) => {
    const body = {
      name: billAttributes.name,
    };

    let allBills = await Bill.all();

    assert.lengthOf(allBills, 0);

    const response = await client
      .post(route("BillsController.create"))
      .json(body)
      .loginAs(user);

    response.assertStatus(201);

    allBills = await Bill.all();

    assert.lengthOf(allBills, 1);

    assert.equal(allBills[0].name, billAttributes.name);
    assert.equal(allBills[0].userId, user.id);
  });

  test("should create with optional params", async ({
    client,
    route,
    assert,
  }) => {
    const body = {
      name: billAttributes.name,
      dueDay: billAttributes.dueDay,
      description: billAttributes.description,
    };

    let allBills = await Bill.all();

    assert.lengthOf(allBills, 0);

    const response = await client
      .post(route("BillsController.create"))
      .json(body)
      .loginAs(user);

    response.assertStatus(201);

    allBills = await Bill.all();

    assert.lengthOf(allBills, 1);

    assert.equal(allBills[0].name, billAttributes.name);
    assert.equal(allBills[0].description, billAttributes.description);
    assert.equal(allBills[0].dueDay, billAttributes.dueDay);
    assert.equal(allBills[0].userId, user.id);
  });
});

test.group("Bills - Create (Failure) ", (group) => {
  setupGroupHooks(group);

  test("should return error without user auth", async ({ client, route }) => {
    const body = {
      name: billAttributes.name,
      dueDay: billAttributes.dueDay,
    };

    const response = await client
      .post(route("BillsController.create"))
      .json(body);

    response.assertStatus(401);
    response.assertBodyContains({
      errors: [{ message: "Access unauthorized" }],
    });
  });

  test("should return error without param name", async ({ client, route }) => {
    const body = {
      dueDay: billAttributes.dueDay,
      description: billAttributes.description,
    };

    const response = await client
      .post(route("BillsController.create"))
      .json(body)
      .loginAs(user);

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [{ message: "The 'name' is required" }],
    });
  });
});
