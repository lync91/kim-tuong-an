const knex = require('./connect');
const initdb = {
    createTable: () => {
        knex.schema
            .createTable('users', (table) => {
                table.increments('id');
                table.string('first_name', 255);
                table.string('last_name', 255);
            });
    },
    createCamDo: () => {
        knex.schema
            .createTable('camdo', (table) => {
                table.increments('id');
                table.string('first_name', 255);
                table.string('last_name', 255);
            }).then((rows) => {
                console.log(rows);
            });
    },
    dropCamDo: () => {
        knex.schema.dropTable('camdo')
            .then((res) => {
                console.log(res);
            });
    }
};
module.exports = initdb;
