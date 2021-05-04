const knex = require('./connect')
const initdb = {
    createTable: () => {
        console.log('OK');
        knex.schema
            .createTable('users', function (table) {
                table.increments('id');
                table.string('first_name', 255).notNullable();
                table.string('last_name', 255).notNullable();
            });
    }
}
module.exports = initdb;