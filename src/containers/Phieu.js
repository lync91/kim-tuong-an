import React, { useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import { Col, Row } from 'antd';

import docso from '../utils/sorachu';
import { any } from 'prop-types';
import moment from 'moment';

function Phieu(props) {
  const { formData, hideCuong } = props;
  const [ngaytinhlai, setngaytinhlai] = useState('');
  const [ngaycam, setNgaycam] = useState('')
  useEffect(() => {
    console.log(formData.ngaytinhlai);
    const _ngaytinhlai = formData.ngaytinhlai ? moment(formData.ngaytinhlai).format('DD/MM/YYYY') : '';
    const _ngaycam = formData.ngayCamChuoc ? formData.ngayCamChuoc[0].format('DD/MM/YYYY').toString() : '';
    setngaytinhlai(_ngaytinhlai);
    setNgaycam(_ngaycam);
    return () => {

    }
  }, [formData])
  return (
    <Row>
      <Col>
        <Row>
          <Col className="phieu-cuong" span="8" hidden={hideCuong}>
            <Row>
              <div className="center">
                <div className="center"><h3>{formData.ngayCamChuoc ? formData.ngayCamChuoc[0].format('h:mm A') : ''}</h3></div><br />
                <div>
                  <Barcode value={formData.sophieu ? formData.sophieu : '123456'} /><br />
                </div>
                <b>{formData.tenkhach}</b><br />
                <b>{formData.dienthoai}</b><br />
                <b>{`${formData.monhang} (${formData.loaivang})`}</b><br /><br />
                <b>{`Trọng lượng ${formData.trongluongthuc}`}</b><br /><br />
                <b>{`${formData.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b><br />

              </div>
            </Row>
          </Col>
          <Col className="phieu-tam" span="16">
            <Row className="phieu-header-row">
              <Col span="12">
                <Row>
                  <div className="center">
                    CÔNG TY TNHH MTV<br />
                                            TIỆM VÀNG VÀ CẦM ĐỒ<br />
                    <div className="phieu-logo">
                      KIM TƯỜNG AN
                                        </div>
                  </div>
                </Row>
              </Col>
              <Col span="12">
                <Row>
                  <div className="center">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
                                            Độc lập - Tự Do - Hạnh Phúc<br />
                                            ..............oOo..............
                                    </div>
                </Row>
                <Row>
                  <div className="qr-code">
                    <div className="phieu-time">{formData.ngayCamChuoc ? formData.ngayCamChuoc[0].format('h:mm A') : ''}</div><br />
                    <div>
                      <Barcode value={formData.sophieu ? formData.sophieu : '123456'} />
                    </div>
                  </div>
                </Row>
              </Col>
            </Row>
            <Row>
              <div className="center phieu-title">
                BIÊN LAI CẦM ĐỒ
                            </div>
            </Row>
            <Row>
              <div className="phieu-content">
                Ông bà: <b>{formData.tenkhach}</b><br />
                                        ĐT: <b>{formData.dienthoai}</b><br />
                                        Món hàng: <b>{`${formData.monhang} (${formData.loaivang}) - Trọng lượng: ${formData.trongluongthuc}`}</b><br /><br />
                                        Số tiền cầm: <b>{`${formData.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b><br />
                                        Viết bằng chữ: <div className="bangchu"><i>{docso(formData.tiencam)} đồng</i></div><br />
                <Row>
                  <Col span={12}>
                    Ngày cầm: <b>{ngaycam}</b><br />
                    <p style={{paddingLeft: 85}} hidden={ngaycam === ngaytinhlai ? true : false}><b>({ngaytinhlai})</b></p>
                  </Col>
                  <Col> Ngày chuộc: <b>{formData.ngayCamChuoc ? formData.ngayCamChuoc[1].format('DD/MM/YYYY').toString() : ''}</b></Col><br />
                </Row>
                                        Người lập phiếu: <br />
                <b>Biên nhận có giá trị trong 30 ngày</b> (Nếu chưa chuộc thì quý khách phải đến đóng lãi mỗi tháng một lần)<br />
                <b>Sau 30 </b>ngày kể từ ngày cầm mà quý khách không thực hiện đúng nghĩa vụ đóng lãi hoặc chuộc tài sản, coi như quý khác đã tự ý bỏ tài sản, cửa hàng sẽ <b>thanh lý </b>đển đảm bảo nguồn vốn. Mọi thắc mắc và khiếu nại về sau cửa hàng không giải quyết. <b><u>Cửa hàng không giải quyết trường hợp mất giấy.</u></b><br />
              </div>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
Phieu.propTypes = any;
export default Phieu;
