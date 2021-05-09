import { remote } from 'electron';
const knex = remote.require('./db/connect');

export const initdb = {
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
                table.integer('ngaychuoc');
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
    }
};
