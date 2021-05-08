import { any } from 'prop-types';
import React, { useEffect } from 'react';
import docso from '../utils/sorachu';

export function TemplatePhieu(props) {
  const { data } = props;
  // const [src, setStc] = useState('')
  useEffect(() => {

  }, []);
  return (
    <div className="row">
      <div className="column center" >
        <h3></h3>
        <p><b>{data.ngayCamChuoc[0].format('h:m A')}</b></p>
        <img style={{ width: '100px' }} src={data.src} />
        <p><b>{data.tenkhach}</b></p>
        <p><b>{`${data.monhang} (${data.loaivang})`}</b></p>
        <p><b>{data.trongluongthuc}</b></p>
        <p><b>{`${data.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></p>
        <p><b>{data.ngayCamChuoc[0].format('DD/MM/YYYY')}</b></p>
      </div>
      <div className="column" style={{paddingLeft: 100, width: '75%'}} >
        <h2></h2>
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="bar-code" style={{position: 'absolute', right: 50, top: 20}}>
          <p><b>{data.ngayCamChuoc[0].format('h:m A')}</b></p>
          <img style={{ width: '100px' }} src={data.src} />
        </div>
        <p><b>{data.tenkhach}</b></p>
        <p><b>{`${data.monhang} (${data.loaivang})`}</b> - Trọng lượng: <b>{data.trongluongthuc}</b></p>
        <p><b>{`${data.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></p>
        <p><div className="bangchu"><i>{`${docso(data.tiencam)}`}</i></div></p>
        <p>
          <div style={{position: 'absolute', left: 320}}>
            <b>{data.ngayCamChuoc[0].format('DD/MM/YYYY')}</b>
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
