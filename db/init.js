const { fn } = require('moment');
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
        table.string('sophieu');
        table.string('tenkhach');
        table.string('dienthoai');
        table.string('monhang');
        table.string('loaivang');
        table.float('tongtrongluong');
        table.float('trongluonghot');
        table.float('trongluongthuc');
        table.integer('gianhap');
        table.integer('tiencam');
        table.integer('laisuat');
        table.integer('tienlai');
        table.integer('tienchuoc');
        table.integer('ngaycam');
        table.integer('ngayhethan');
        table.integer('ngaytinhlai');
        table.integer('ngaychuoc');
        table.integer('dachuoc');
        table.string('tudo');
        table.integer('dahuy');
        table.timestamps();
      }).then((rows) => {
        console.log(rows);
      });
  },
  dropCamDo: () => {
    knex.schema.dropTable('camdo')
      .then((res) => {
        console.log(res);
      });
  },
  createGiaHan: () => {
    knex.schema
      .createTable('giahan', (table) => {
        table.increments('id');
        table.integer('sophieu');
        table.integer('ngaytinhlai');
        table.integer('ngayhethan');
      }).then((rows) => {
        console.log(rows);
      })
  },
  dropGiaHan: () => {
    knex.schema.dropTable('giahan')
      .then((res) => {
        console.log(res);
      })
  },
  dropTable: (table) => {
    const prom = new Promise((res, rej) => {
      knex.schema.dropTable(table)
        .then((r) => {
          res(r)
        })
        .catch(e => rej(e))
    })
    return prom
  },
  createSettings: () => {
    const a = new Promise((res, rej) => {
      knex.schema
        .createTable('settings', (table) => {
          table.increments('id');
          table.integer('gia18K')
          table.integer('gia23K')
          table.integer('gia9999')
          table.integer('lai10')
          table.integer('lai20')
          table.integer('lai30')
          table.integer('tienToiThieu')
        }).then(r => res(r))
        .catch(e => rej(e))
    })
    return a;
  },
  createSettingsDetails: () => {
    const a = new Promise((res, rej) => {
      knex('settings')
        .insert({
          gia18K: 2500000,
          gia23K: 4200000,
          gia9999: 4500000,
          lai10: 5,
          lai20: 4,
          lai30: 3,
          tienToiThieu: 5000
        })
        .then(r => res(r))
        .catch(e => rej(e))
    })
    return a;
  }
};
module.exports = initdb;
