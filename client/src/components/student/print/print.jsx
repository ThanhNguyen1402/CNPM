import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/modal';
import axios from 'axios';
import domain from '../../../config/domain.config';
import { formatDateTime } from '../../../tool/dateFormatter.tool';
import { FaMagnifyingGlass } from "react-icons/fa6";
import styles from './print.module.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useNavigate } from 'react-router-dom';


const Files = (props) =>
{
      return (
            <div className="d-flex align-items-center row w-100">
                  <p className="col-5">{ props.name }</p>
                  <p className="col-3 text-center">{ formatDateTime(props.uploadTime) }</p>
                  <p className="col-2 text-center">{ props.size }</p>
                  <div className='col-2 text-center'>
                        <button className="btn btn-sm btn-primary" onClick={ () =>
                        {
                              props.setChosenFile(props.id);
                              props.setFileModal(false);
                              props.setConfigModal(true);
                              props.setRender(!props.render);
                        } }>Chọn</button>
                  </div>
            </div>
      )
}

const Printer = (props) =>
{
      const [name, setName] = useState("N/A");
      const [model, setModel] = useState("N/A");
      const [campus, setCampus] = useState("N/A");
      const [building, setBuilding] = useState("N/A");
      const [room, setRoom] = useState("N/A");
      const [status, setStatus] = useState("N/A");
      const [description, setDescription] = useState("N/A");

      useEffect(() =>
      {
            axios.get(`http://${ domain }:8080/spso/printer-info`, { params: { id: props.id } })
                  .then(res =>
                  {
                        const locationComponents = res.data[0].location.split('/');

                        setName(res.data[0].name);
                        setModel(res.data[0].model);
                        setStatus(res.data[0].status);
                        setDescription(res.data[0].description ? res.data[0].description : "N/A");
                        setRoom(locationComponents[0]);
                        setBuilding(locationComponents[1]);
                        setCampus(locationComponents[2]);
                  })
                  .catch(err => console.error(err));
      }, [props.id]);

      return (
            <tr key={ props.id }>
                  <td className="align-middle">{ props.index }</td>
                  <td className="align-middle">{ name }</td>
                  <td className="align-middle">{ model }</td>
                  <td className="align-middle">{ room }</td>
                  <td className="align-middle">{ building }</td>
                  <td className="align-middle">{ campus }</td>
                  <td className="align-middle" style={ { color: status ? '#006400' : '#D2122E' } }>{ status ? "Đang hoạt động" : "Ngừng hoạt động" }</td>
                  <td className="align-middle" style={ { whiteSpace: 'nowrap' } }>{ description }</td>
                  <td className="d-flex align-items-center">
                        <button disabled={ !status } className="btn btn-sm btn-primary ms-2" onClick={ () => { props.setChosenPrinter(props.id); props.setFileModal(true); props.setRender(!props.render); } }>Chọn</button>
                  </td>
            </tr>
      )
}

const ConfigModal = (props) =>      
{
      const [fieldNull, setFieldNull] = useState(false);
      const [fromToError, setFromToError] = useState(false);
      const [vertical, setVertical] = useState(props.chosenConfig.vertical);
      const [doubleSide, setDoubleSide] = useState(props.chosenConfig.doubleSide);
      const [paperType, setPaperType] = useState(props.chosenConfig.paperType);
      const [from, setFrom] = useState(props.chosenConfig.from);
      const [to, setTo] = useState(props.chosenConfig.to);
      const [copy, setCopy] = useState(props.chosenConfig.copy);

      return (
            <Modal
                  centered
                  show={ props.configModal }
                  onHide={ () => { props.setConfigModal(false); } }
            >
                  <Modal.Header closeButton>
                        <Modal.Title>
                              Thiết lập cấu hình in
                        </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div className='d-flex align-items-center'>
                              <strong className='me-3'>Số bản in</strong>
                              <ButtonGroup>
                                    <button className='btn btn-sm btn-secondary' onClick={ () =>
                                    {
                                          if (copy > 1)
                                                setCopy(copy - 1)
                                          else
                                                setCopy(1);
                                    } }>-</button>
                                    <input className='text-center' style={ { width: "60px" } } type='number' min={ 1 } value={ copy } onChange={ e =>
                                    {
                                          if (e.target.value < 1 || e.target.value === '')
                                                setCopy(1);
                                          else setCopy(parseInt(e.target.value));
                                    } }></input>
                                    <button className='btn btn-sm btn-secondary' onClick={ () => setCopy(copy + 1) }>+</button>
                              </ButtonGroup>
                        </div>
                        <div className='d-flex flex-column my-3'>
                              <strong>
                                    In từ trang <input style={ { width: "80px" } } min={ 1 } type='number' value={ from ? from : '' }
                                          onChange={ e =>
                                          {
                                                if (e.target.value < 1 || e.target.value === '')
                                                      setFrom(1);
                                                else
                                                      setFrom(parseInt(e.target.value));
                                          } }></input> đến trang <input style={ { width: "80px" } } min={ 1 } type='number' value={ to ? to : '' }
                                                onChange={ e =>
                                                {
                                                      if (e.target.value < 1 || e.target.value === '')
                                                            setTo(1);
                                                      else
                                                            setTo(parseInt(e.target.value));
                                                } }></input>
                              </strong>
                              { fieldNull && <strong className="text-danger">Thiếu trường thông tin!</strong> }
                              { fromToError && <strong className="text-danger">Trang bắt đầu in và trang kết thúc in không hợp lệ!</strong> }
                        </div>
                        <div className='d-flex align-items-center my-3'>
                              <strong className='me-3'>Loại in</strong>
                              <select style={ { width: "120px" } } value={ doubleSide } onChange={ e => setDoubleSide(parseInt(e.target.value)) }>
                                    <option value={ 0 }>In 1 mặt</option>
                                    <option value={ 1 }>In 2 mặt</option>
                              </select>
                        </div>
                        <div className='d-flex align-items-center my-3'>
                              <strong className='me-3'>Kiểu in</strong>
                              <select style={ { width: "120px" } } value={ vertical } onChange={ e => setVertical(parseInt(e.target.value)) }>
                                    <option value={ 1 }>In đứng</option>
                                    <option value={ 0 }>In ngang</option>
                              </select>
                        </div>
                        <div className='d-flex align-items-center mt-3'>
                              <strong className='me-3'>Khổ giấy</strong>
                              <select style={ { width: "120px" } } value={ paperType } onChange={ e => setPaperType(e.target.value) }>
                                    <option>A0</option>
                                    <option>A1</option>
                                    <option>A2</option>
                                    <option>A3</option>
                                    <option>A4</option>
                              </select>
                        </div>
                  </Modal.Body>
                  <Modal.Footer className='d-flex justify-content-between'>
                        <strong>Tổng số trang giấy: { from && to && from <= to && (doubleSide ? copy * (Math.round((to - from + 1) / 2)) : copy * (to - from + 1)) }</strong>
                        <div className='d-flex align-items-center'>
                              <button className="btn btn-danger me-2" onClick={ () =>
                              {
                                    props.setConfigModal(false);
                                    props.setChosenFile(null);
                                    props.setChosenPrinter(null);
                                    props.setRender(!props.render);
                              } }>Hủy</button>
                              <button className="btn btn-success ms-2" onClick={ () =>
                              {
                                    let isOk = true;
                                    setFieldNull(false);
                                    setFromToError(false);
                                    if (!from || !to)
                                    {
                                          isOk = false;
                                          setFieldNull(true);
                                    }
                                    else
                                    {
                                          if (from > to)
                                          {
                                                isOk = false;
                                                setFromToError(true);
                                          }
                                    }
                                    let counter = to - from + 1;
                                    if (doubleSide) counter = Math.round(counter / 2);
                                    counter *= copy;
                                    if (props.myPages[paperType] < counter)
                                    {
                                          isOk = false;
                                          props.setNotEnough(true);
                                          props.chosenConfig.vertical = vertical;
                                          props.chosenConfig.doubleSide = doubleSide;
                                          props.chosenConfig.paperType = paperType;
                                          props.chosenConfig.from = from;
                                          props.chosenConfig.to = to;
                                          props.chosenConfig.copy = copy;
                                    }
                                    if (isOk)
                                    {
                                          props.chosenConfig.vertical = vertical;
                                          props.chosenConfig.doubleSide = doubleSide;
                                          props.chosenConfig.paperType = paperType;
                                          props.chosenConfig.from = from;
                                          props.chosenConfig.to = to;
                                          props.chosenConfig.copy = copy;
                                    }
                                    props.setConfirmModal(isOk);
                              } }>In ngay</button>
                        </div>
                  </Modal.Footer>
            </Modal>
      )
}

export default function Print()
{
      const [fileModal, setFileModal] = useState(false);
      const [configModal, setConfigModal] = useState(false);
      const [confirmModal, setConfirmModal] = useState(false);
      const [notEnough, setNotEnough] = useState(false);
      const [successModal, setSuccessModal] = useState(false);

      const [printers, setPrinters] = useState([]);
      const [searchPrinter, setSearchPrinter] = useState('');
      const [searchFile, setSearchFile] = useState('');
      const [uploadedFiles, setUploadedFiles] = useState([]);

      const [chosenPrinter, setChosenPrinter] = useState(null);
      const [chosenFile, setChosenFile] = useState(null);
      const [chosenConfig, setChosenConfig] = useState(null);

      const [render, setRender] = useState(false);

      const [myPages, setMyPages] = useState(null);

      const Navigate = useNavigate();

      let timer;

      const printDocument = () =>
      {
            axios.post(`http://${ domain }:8080/student/print-document`, { params: { config: chosenConfig, file: chosenFile, printer: chosenPrinter } }, { withCredentials: true })
                  .then(res =>
                  {
                        setConfirmModal(false);
                        setConfigModal(false);
                        setSuccessModal(true);
                        setRender(!render);
                  })
                  .catch(err => console.error(err));
      }

      useEffect(() =>
      {
            setChosenConfig(null);
            axios.get(`http://${ domain }:8080/student/printer-list`, { params: { search: searchPrinter } })
                  .then(res =>
                  {
                        setPrinters(res.data);
                  })
                  .catch(err => console.error(err));

            axios.get(`http://${ domain }:8080/student/file-list`, { params: { name: searchFile }, withCredentials: true })
                  .then(res =>
                  {
                        setUploadedFiles(res.data);
                  })
                  .catch(err => console.error(err));

            axios.get(`http://${ domain }:8080/student/default-print-config`)
                  .then(res =>
                  {
                        setChosenConfig({ paperType: res.data[0].paperType, doubleSide: res.data[0].doubleSide ? 1 : 0, vertical: res.data[0].vertical ? 1 : 0, from: null, to: null, copy: 1 });
                  })
                  .catch(err => console.error(err));

            axios.get(`http://${ domain }:8080/student/current-page`, { withCredentials: true })
                  .then(res =>
                  {
                        setMyPages({ A0: res.data[0].A0papers, A1: res.data[0].A1papers, A2: res.data[0].A2papers, A3: res.data[0].A3papers, A4: res.data[0].A4papers });
                  })
      }, [searchPrinter, searchFile, render])

      return (
            <div className="w-100 h-100 d-flex">
                  <div className='w-75 h-75 m-auto p-1 bg-white rounded'>
                        <div className="mt-3 mb-3 d-flex align-items-center" style={ { fontSize: '1.2rem' } } >
                              <input type="text" className="ps-4" placeholder="Tìm kiếm" onChange={ e =>
                              {
                                    clearTimeout(timer);
                                    timer = setTimeout(() => setSearchPrinter(e.target.value), 1000);
                              } }></input>
                              <FaMagnifyingGlass className="position-absolute ms-1" />
                        </div>
                        <div className="w-100 overflow-auto" style={ { maxHeight:'600px'}}>
                              <table className="table table-hover">
                                    <thead>
                                          <tr>
                                                <th className="col-1">STT</th>
                                                <th className="col-1">Tên</th>
                                                <th className="col-1">Mẫu mã</th>
                                                <th className="col-1">Phòng</th>
                                                <th className="col-1">Tòa</th>
                                                <th className="col-2">Cơ sở</th>
                                                <th className="col-2">Trạng thái</th>
                                                <th className="col-2">Mô tả</th>
                                                <th className="col-1">Tác vụ</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { printers.map((printer, index) =>
                                          {
                                                return (
                                                      <Printer key={ printer.id } index={ index + 1 } id={ printer.id } setChosenPrinter={ setChosenPrinter } setFileModal={ setFileModal } setRender={ setRender } render={ render } />
                                                );
                                          }) }
                                    </tbody>
                              </table>
                        </div>
                  </div>
                  <Modal
                        centered
                        show={ fileModal }
                        onHide={ () => { setFileModal(false); } }
                        dialogClassName={ `${ styles.fileModal }` }
                  >
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    Chọn file
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="d-flex align-items-center mb-2" style={ { fontSize: '1.2rem' } } >
                                    <input type="text" className="ps-4" onChange={ e =>
                                    {
                                          clearTimeout(timer);
                                          timer = setTimeout(() =>
                                          {
                                                setSearchFile(e.target.value);
                                          }, 1000);
                                    } }></input>
                                    <FaMagnifyingGlass className="position-absolute ms-1" />
                              </div>
                              <div className="w-100 row d-flex align-items-center mb-2">
                                    <strong className="col-5">Tên tệp</strong>
                                    <strong className="col-3 text-center">Thời gian lưu</strong>
                                    <strong className="col-2 text-center">Kích thước tệp</strong>
                                    <strong className="col-2 text-center">Tác vụ</strong>
                              </div>
                              <div className="overflow-auto" style={ { maxHeight: '500px' } }>
                                    { !!uploadedFiles.length && uploadedFiles.map((file, index) => <Files key={ index } name={ file.name } size={ file.fileSize }
                                          id={ file.id } uploadTime={ file.uploadTime } setFileModal={ setFileModal } setConfigModal={ setConfigModal } setChosenFile={ setChosenFile } setRender={ setRender } render={ render } />) }
                              </div>
                        </Modal.Body>
                        <Modal.Footer>
                              <button className="btn btn-danger" onClick={ () =>
                              {
                                    setFileModal(false);
                                    setChosenFile(null);
                                    setChosenPrinter(null);
                                    setRender(!render);
                              } }>Hủy</button>
                        </Modal.Footer>
                  </Modal>

                  <Modal
                        show={ confirmModal }
                        onHide={ () => { setConfirmModal(false); } }
                  >
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    Xác nhận in?
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                              <button className="btn btn-danger" onClick={ () =>
                              {
                                    setConfirmModal(false);
                              } }>Quay lại</button>
                              <button className="btn btn-success" onClick={ printDocument }>Xác nhận</button>
                        </Modal.Footer>
                  </Modal>

                  <Modal
                        show={ successModal }
                        onHide={ () => { setSuccessModal(false); } }
                  >
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    In tài liệu thành công!
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                              <button className="btn btn-success" onClick={ () => { setSuccessModal(false); } }>Hoàn tất</button>
                        </Modal.Footer>
                  </Modal>

                  { chosenConfig && myPages && <Modal
                        show={ notEnough }
                        onHide={ () => { setNotEnough(false); } }
                  >
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    Không đủ giấy in!
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              Số giấy in { chosenConfig.paperType } còn lại: { myPages[chosenConfig.paperType] }
                        </Modal.Body>
                        <Modal.Footer>
                              <button className="btn btn-danger" onClick={ () =>
                              {
                                    setNotEnough(false);
                              } }>Quay lại</button>
                              <button className="btn btn-primary" onClick={ () => Navigate('/buy') }>Mua thêm giấy</button>
                        </Modal.Footer>
                  </Modal> }

                  { chosenConfig && <ConfigModal configModal={ configModal } setConfigModal={ setConfigModal }
                        setChosenFile={ setChosenFile } setChosenPrinter={ setChosenPrinter } setRender={ setRender } render={ render }
                        setNotEnough={ setNotEnough } chosenConfig={ chosenConfig } setConfirmModal={ setConfirmModal } myPages={ myPages } /> }
            </div>
      )
}