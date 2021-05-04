const path = require('path');
const { app } = require('electron')
const url = require('url');
const pathd = app.getAppPath();
const isDevelopment = process.env.NODE_ENV === 'development';
var knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: isDevelopment? path.join(__dirname, '..', 'data/database.sqlite') : path.join(__dirname, '..','..', 'data/database.sqlite')
	}
});

module.exports = knex;
