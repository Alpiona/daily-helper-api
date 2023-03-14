import Factory from "@ioc:Adonis/Lucid/Factory";
import Bill from "App/Models/Bill";
import PaymentFactory from "./PaymentFactory";
import UserFactory from "./UserFactory";

export default Factory.define(Bill, ({ faker }) => {
  return {
    name: faker.lorem.words(2),
    dueDay: faker.datatype.number({ min: 1, max: 28 }),
    description: faker.lorem.words(5),
  };
})
  .relation("user", () => UserFactory)
  .relation("payments", () => PaymentFactory)
  .build();
