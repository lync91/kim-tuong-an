import { remote } from 'electron';
import moment from 'moment';
const knex = remote.require('./db/connect');
const db = remote.require('./db');

export async function getLastId(fn) {
  knex('camdo').max({ a: 'id' })
    .then(res => {
      const id = res[0].a;
      fn(id);
    });
}
export function insertCamdo(data, fn) {
  db.test(res => console.log(res))
  data.ngaycam = data.ngayCamChuoc[0].format('x');
  data.ngayhethan = data.ngayCamChuoc[1].format('x');
  delete data.size;
  delete data.ngayChuocCam;
  delete data.gia18K;
  delete data.gia24K;
  delete data.gia9999;
  delete data.ngayCamChuoc;
  data.tongtrongluong = Number(data.tongtrongluong);
  console.log(data);
  knex('camdo').insert(data)
    .then(res => fn(res));
}
export function getCamDo(key, fn) {
  console.log(key);
  const camdo = knex('camdo').select()
    .orderBy('id', 'desc')
  if (key === 'tatca') camdo.then(res => fn(res));
  if (key === 'conhan') knex('camdo')
    .where((builder) =>
      builder.where('dachuoc', '<=', 0)
    )
    .andWhere('ngayhethan', '>', moment().format('x'))
    .then(res => fn(res));
  if (key === 'quahan') knex('camdo')
    .where((builder) =>
      builder.where('dachuoc', '<=', 0)
    )
    .andWhere('ngayhethan', '<', moment().format('x'))
    .then(res => fn(res));
  if (key === 'dachuoc') knex('camdo')
    .where((builder) =>
      builder.where('dachuoc', '>', 0)
    )
    .then(res => fn(res));
}
