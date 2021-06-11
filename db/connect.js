const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development';
const filePath = isDevelopment ? path.join(__dirname, '..', 'data/database.sqlite') : path.join(__dirname, '..', '..', '/database.sqlite');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: isDevelopment ? path.join(__dirname, '..', 'data/database.sqlite') : path.join(__dirname, '..', '..', '/database.sqlite')
    }
});

module.exports = knex;
