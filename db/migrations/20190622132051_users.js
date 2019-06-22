
exports.up = async function(knex) {
    await knex.schema.createTable('users', t => {
        t.integer('id')
            .notNullable()
            .primary();
        t.text('username', 'longtext');
        t.text('password', 'longtext');
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('users');
};
