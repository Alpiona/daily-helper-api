import Factory from "@ioc:Adonis/Lucid/Factory";
import Payment from "App/Models/Payment";
import { DateTime } from "luxon";
import BillFactory from "./BillFactory";

export default Factory.define(Payment, ({ faker }) => {
  return {
    value: faker.datatype.number({ min: 100, max: 9999 }),
    referenceDate: DateTime.now().startOf("month"),
    description: faker.lorem.words(5),
    paidAt: DateTime.now(),
  };
})
  .relation("bill", () => BillFactory)
  .build();
