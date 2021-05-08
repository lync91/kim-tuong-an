const path = require('path');
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

const test = (fn) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const filePath = isDevelopment ? path.join(__dirname, '..', 'data/database.sqlite') : path.join(__dirname, '..', '..', 'data/database.sqlite');
  fn(filePath)
}

module.exports = {
  insertPhieuCam,
  initdb,
  test
};
