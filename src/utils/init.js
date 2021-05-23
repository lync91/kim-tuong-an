import { remote } from 'electron';
import { exists } from 'original-fs';
const knex = remote.require('./db/connect');
const init = remote.require('./db/init')

export const createCamDo = () => {
  init.createCamDo()
};
export const dropCamDo = (fn) => {
  knex.schema.dropTable('camdo')
    .then((res) => {
      fn(true)
    });
}
export const resetData = () => {
  try {
    knex.schema.hasTable('camdo').then((exists) => {
      if (exists) {
        knex.schema.dropTable('camdo')
          .then((res) => {
            init.createCamDo();
          });
      } else {
        init.createCamDo();
      }
    })
    knex.schema.hasTable('giahan').then((exists) => {
      if (exists) {
        knex.schema.dropTable('giahan')
          .then((res) => {
            init.createGiaHan();
          });
      } else {
        init.createGiaHan();
      }
    })
  } catch (error) {
    console.log(error);
  }
}

