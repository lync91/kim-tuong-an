const { ipcMain } = require('electron');
const initdb = require('./init');
const knex = require('./connect');

// ipcMain.on('asynchronous-message', (event, arg) => {
//     const result = knex.select('FirstName').from('user');
//     result.then(function(rows, err) {
//         console.log(rows);
//         event.sender.send('ping', rows);
//     });
// });
// ipcMain.on('ping1', (event, arg) => {
//     event.sender.send('ping1', 'rows');
// });
// ipcMain.on('up', (event, arg) => {
//     initdb.createTable();
// });
// ipcMain.on('getData', (event, arg) => {
//     const result = knex.select('FirstName').from('user');
//     result.then(function(rows, err) {
//         console.log(rows);
//         event.sender.send('tableResult', rows);
//     });
// });
// ipcMain.on('addPhieuCam', (event, arg) => {
//     console.log(arg);
//     knex('camdo').insert(arg)
//         .then((cd) => {
//             console.log(cd);
//         });
// });

const insertPhieuCam = (data) => {
    delete data.size;
    delete data.ngayChuocCam;
    delete data.dienthoai;
    delete data.key;
    console.log(data);
    knex('camdo').insert(data)
        .then((cd) => {
            console.log(cd);
        });
};

module.exports = {
    insertPhieuCam,
    initdb
};
