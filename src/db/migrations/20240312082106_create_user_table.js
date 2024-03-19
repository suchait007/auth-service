/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
    return knex.schema.createTable('users', function(table) {
        table.increments('user_id').primary();
        table.string('name');
        table.string('email');
        table.string('password');
        table.string('role');
        table.timestamp('created_at');
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
