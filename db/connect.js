const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development';
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: isDevelopment ? path.join(__dirname, '..', 'data/database.sqlite') : path.join(__dirname, '..', '..', 'data/database.sqlite')
    }
});

module.exports = knex;
