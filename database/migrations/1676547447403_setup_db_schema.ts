import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SetupDbSchema extends BaseSchema {
  public async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  }

  public async down() {
    this.schema.raw('DROP EXTENSION IF EXISTS "pgcrypto"')
    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
  }
}
