import { remote } from 'electron';
const knex = remote.require('./db/connect');

export async function getLastId(fn) {
    knex('camdo').max({a: 'id'})
        .then(res => {
            const id = res[0].a;
            fn(id);
        });
}
export function insertCamdo(data, fn) {
    delete data.size;
    delete data.ngayChuocCam;
    knex('camdo').insert(data)
        .then(res => fn(res));
}
