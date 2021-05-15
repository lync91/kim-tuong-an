import { remote } from 'electron';
const knex = remote.require('./db/connect');
const init = remote.require('./db/init')

export const createTable = () => {
  knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.string('first_name', 255);
      table.string('last_name', 255);
    });
};
export const createCamDo = () => {
  init.createCamDo()
};
export const dropCamDo = (fn) => {
  knex.schema.dropTable('camdo')
    .then((res) => {
      fn(true)
    });
}

