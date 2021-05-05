import React from 'react';
import Barcode from 'react-barcode';
import { Col, Row } from 'antd';

import docso from '../utils/sorachu';

function Phieu(props) {
    const { formData } = props;
    return (
        <Row>
            <Col>
                <Row>
                    <Col className="phieu-cuong" span="8">
                        <Row>
                            <div className="center">
                                <div className="center">01:04:AM</div><br />
                                <div>
                                    <Barcode value={formData.key} />
                                </div>
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
                                        <div className="phieu-time">01:04:AM</div><br />
                                        <div>
                                            <Barcode value={formData.key} />
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
                                        Món hàng: <b>{formData.monhang}</b><br /><br />
                                        Số tiền cầm: <b>{`${formData.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b><br />
                                        Viết bằng chữ: <i>{docso(formData.tiencam)} đồng</i><br />
                                <Row><Col span={12}>Ngày cầm: <b>{formData.ngaycam}</b></Col><Col> Ngày chuộc: <b>{formData.ngaychuoc}</b></Col><br /></Row>
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

export default Phieu;
