import { useEffect, useState } from "react"
import axios from "axios";
import domain from "../../../config/domain.config";
import { formatDateTime } from '../../../tool/dateFormatter.tool';

const Log = (props) =>
{
      const [content, setContent] = useState("N/A");

      useEffect(() =>
      {
            if (props.id[0] === 'P')
            {
                  axios.get(`http://${ domain }:8080/student/print-log-info`, { params: { id: props.id } })
                        .then(res =>
                        {
                              setContent(`In file ${ res.data[0].fileName } ${ res.data[0].doubleSide ? '2' : '1' } mặt theo chiều ${ res.data[0].vertical ? 'dọc' : 'ngang' } với tổng ${ res.data[0].totalPaper } trang ${ res.data[0].paperType } bằng ${ res.data[0].printerName } tại ${ res.data[0].printerLocation.replaceAll('/', ', ') }`)
                        }).catch(err => console.error(err));
            }
            else
            {
                  axios.get(`http://${ domain }:8080/student/buy-log-info`, { params: { id: props.id } })
                        .then(res =>
                        {
                              setContent(`Mua ${ res.data[0].numberOfPaper } tờ giấy ${ res.data[0].paperType } với tổng đơn giá ${ res.data[0].cost }đ`);
                        }).catch(err => console.error(err));
            }
      }, [props.id]);

      return (
            <div className="d-flex align-items-center row w-100">
                  <p className="col-1">{ props.i }</p>
                  <p className="col-3">{ props.id[0] === 'P' ? 'In tài liệu' : 'Mua thêm giấy in' }</p>
                  <p className="col-4">{ formatDateTime(props.time) }</p>
                  <div className="col-4 mb-3">{ content }</div>
            </div>
      )
}

export default function History()
{
      const [logs, setLog] = useState([]);

      useEffect(() =>
      {
            axios.get(`http://${ domain }:8080/student/get-log-list`, { withCredentials: true })
                  .then(res =>
                  {
                        setLog(res.data);
                  })
                  .catch(err => console.error(err));
      }, []);

      return (
            <div className="w-75 h-75 bg-white rounded-4 m-auto d-flex flex-column">
                  <div className="d-flex align-self-center mt-4 w-100 px-3" >
                        <div className="w-100 row d-flex align-items-center">
                              <strong className="col-1">STT</strong>
                              <strong className="col-3">Loại sự kiện</strong>
                              <strong className="col-4">Thời gian</strong>
                              <strong className="col-4">Nội dung</strong>
                        </div>
                  </div>
                  <hr className="mt-0"></hr>
                  <div className="mx-auto mb-1 overflow-auto w-100 px-4 flex-grow-1" style={ { maxHeight: '800px' } }>
                        { !!logs.length && logs.map((log, idx) => <Log key={ idx } i={ idx + 1 } id={ log.id } time={ log.time } />) }
                  </div>
            </div>
      )
}