const initdb = require('./init');
const knex = require('./connect');

const insertPhieuCam = (data) => {
    delete data.size;
    delete data.ngayChuocCam;
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
