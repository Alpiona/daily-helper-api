import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "payments";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid("id")
        .primary()
        .defaultTo(this.db.knexRawQuery("uuid_generate_v4()"));
      table
        .uuid("bill_id")
        .references("id")
        .inTable("bills")
        .onDelete("CASCADE")
        .notNullable()
        .index();
      table.string("description").nullable();
      table.decimal("value").nullable();
      table.dateTime("paid_at", { useTz: true }).notNullable();
      table.date("reference_date").notNullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
