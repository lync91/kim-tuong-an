const { ipcMain } = require('electron');
const initdb = require('./init');
const knex = require('./connect');

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log("heyyyy", arg) // prints "heyyyy ping"
    let result = knex.select("FirstName").from("user")
		result.then(function(rows, err){
            console.log(rows);
            event.sender.send('ping', rows);
		})
});
ipcMain.on('ping1', (event, arg) => {
    event.sender.send('ping1', 'rows');
});
ipcMain.on('up', (event, arg) => {
    initdb.createTable();
});
ipcMain.on('getData', (event, arg) => {
    let result = knex.select("FirstName").from("user")
		result.then(function(rows, err){
            console.log(rows);
            event.sender.send('tableResult', rows);
		})
});
ipcMain.on('addPhieuCam', (event, arg) => {
    console.log(arg);
    knex('camdo').insert(arg)
    .then((cd) => {
        console.log(cd);
    })
});
