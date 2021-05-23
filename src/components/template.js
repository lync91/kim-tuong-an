import moment from 'moment';
import { any } from 'prop-types';
import React, { useEffect, useState } from 'react';
import docso from '../utils/sorachu';

export function TemplatePhieu(props) {
  const { data } = props;
  const [ngaycam, setNgaycam] = useState('');
  const [ngaytinhlai, setNgaytinhlai] = useState('');

  // const [src, setStc] = useState('')
  useEffect(() => {
  }, []);
  return (
    <div className="row">
      <div className="column center" >
        <h3></h3>
        <p><b>{data.ngayCamChuoc[0].format('h:m A')}</b></p>
        <img style={{ width: '100px' }} src={data.src} />
        <p style={{fontSize: 28, marginTop: 2, marginBottom: 2}}><b>{data.sophieu}</b></p>
        <p style={{fontSize: 28, margin: 2}}><b>{data.tenkhach}</b></p>
        <p style={{margin: 2}}><b>{`${data.monhang} (${data.loaivang})`}</b></p>
        <p style={{margin: 2}}><b>{data.trongluongthuc} chỉ</b></p>
        <p style={{margin: 2}}><b>{`${data.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></p>
        <p style={{margin: 2}}><b>{data.ngayCamChuoc[0].format('DD/MM/YYYY')}</b></p>
      </div>
      <div className="column" style={{paddingLeft: 100, width: '75%'}} >
        <h2></h2>
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="bar-code" style={{position: 'absolute', right: 0, top: 50}}>
          <p><b>{data.ngayCamChuoc[0].format('h:m A')}</b></p>
          <img src={data.src} style={{ width: '120px' }} />
          <p style={{fontSize: 18, textAlign:'center', lineHeight: 0.3}}><b>{data.sophieu}</b></p>
        </div>
        <p style={{marginTop: 24}}><b>{data.tenkhach}</b></p>
        <br />
        <p style={{paddingLeft: 25, marginTop: 4}}><b>{`${data.monhang} (${data.loaivang})`}</b> - Trọng lượng: <b>{data.trongluongthuc} chỉ</b></p>
        <p style={{paddingLeft: 20, fontSize: 20, marginTop: 24, marginBottom: 0}}><b>{``}{`${data.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Đ</b></p>
        <p><div style={{paddingLeft: 28, marginBottom: 0, marginTop: 8}} className="bangchu"><i>{`    ${docso(data.tiencam)}`} đồng</i></div></p>
        <p style={{marginTop: 0}}>
          <div style={{position: 'absolute', left: 320}}>
            <b>{data.ngayCamChuoc[0].format('DD/MM/YYYY')}</b>
            <p style={{margin: 2}} hidden={data.ngayCamChuoc[0].format('DD/MM/YYYY') === moment(data.ngaytinhlai).format('DD/MM/YYYY') ? true : false} ><b>({moment(data.ngaytinhlai).format('DD/MM/YYYY')})</b></p>
          </div>
          <div style={{position: 'absolute', right: 50}}>
          <b>{data.ngayCamChuoc[1].format('DD/MM/YYYY')}</b>
          </div>
          </p>
      </div>
    </div>
  )
}

TemplatePhieu.propTypes = any;
export default TemplatePhieu;
