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
  knex('camdo').insert(data)
    .then(res => fn(res));
}
export function updateCamDo(id, data, fn) {
  if (data.ngayCamChuoc) {
    data.ngaycam = moment(data.ngayCamChuoc[0]).format('x');
    data.ngaychuoc = moment(data.ngayCamChuoc[1]).format('x');
  }
  delete data.size;
  delete data.ngayCamChuoc;
  delete data.gia18K;
  delete data.gia24K;
  delete data.gia9999;
  delete data.ngayCamChuoc;
  delete data.songay;
  knex('camdo')
  .where('id', '=', id)
  .update(data)
  .then(res => fn(res))
}
export function getCamDo(key, fn) {
  console.log(key);
  const camdo = knex('camdo').select()
    .orderBy('id', 'desc')
  if (key === 'tatca') camdo.then(res => fn(res));
  if (key === 'conhan') camdo.whereRaw('ngayhethan > ? and dachuoc <= ?', [moment().format('x'), 0]).then(res => fn(res))
  if (key === 'quahan') camdo.whereRaw('ngayhethan < ? and dachuoc <= ?', [moment().format('x'), 0]).then(res => fn(res))
  if (key === 'dachuoc') camdo.whereRaw('dachuoc > ?', [0]).then(res => fn(res))
}
export function deleteCamDo(id, fn) {
  knex('camdo')
  .where('id', id)
  .del()
  .then(res => fn(res));
}
export function timPhieu(sophieu, fn) {
  knex('camdo')
  .where('sophieu', sophieu)
  .then(res => fn(res));
}
export function timPhieubyID(id, fn) {
  knex('camdo')
  .where('id', id)
  .then(res => fn(res));
}
export function timKiem(text, fn) {
  const dateNumber = moment(text, 'DD/MM/YYYY').format('X').toString().substring(0, 5);
  console.log(dateNumber);
  const camdo = knex('camdo');
  camdo.whereRaw(`id = '${text}' or sophieu like '%${text}%' or tenkhach like '%${text}%' or ngaycam like '%${dateNumber}%'`)
  // .orwhere('sophieu', text)
  // .orwhere('tenkhach', 'LIKE', `%${text}%`)
  .then(res => fn(res));
}
