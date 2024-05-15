import { useEffect, useState } from "react";
import styles from "./UsageSettings.module.css";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import domain from '../../../config/domain.config';
import Modal from 'react-bootstrap/Modal';

const UsageSettings = () =>
{
  const [page, setPage] = useState(0);
  const [date, setDate] = useState(1);
  const [types, setTypes] = useState("");
  const [double, setDouble] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [paper, setPaper] = useState("");

  const [render, setRender] = useState(false);
  const [modal, setModal] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() =>
  {
    axios.get(`http://${ domain }:8080/spso/default-configs`)
      .then(res =>
      {
        setPaper(res.data[0][0].paperType);
        setDouble(res.data[0][0].doubleSide);
        setVertical(res.data[0][0].vertical);
        setPage(res.data[2][0].numberOfPage);
        setDate(res.data[2][0].date);
        let temp = "";
        for (let i = 0; i < res.data[1].length; i++)
          temp += res.data[1][i].fileType + ',';
        temp = temp.substring(0, temp.length - 1);
        setTypes(temp);
      })
      .catch(err => console.error(err));
  }, [render]);

  const updatePage = () =>
  {
    axios.put(`http://${ domain }:8080/spso/update-page-number`, { params: { number: page } })
      .then(res => { setRender(!render); setModal(true); })
      .catch(err => console.error(err));
  }

  const updateDate = () =>
  {
    axios.put(`http://${ domain }:8080/spso/update-date`, { params: { date: date } })
      .then(res => { setRender(!render); setModal(true); })
      .catch(err => console.error(err));
  }

  const updateSide = () =>
  {
    axios.put(`http://${ domain }:8080/spso/update-side`, { params: { side: !double } })
      .then(res => { setRender(!render); setModal(true); })
      .catch(err => console.error(err));
  }

  const updatePaper = (paper) =>
  {
    axios.put(`http://${ domain }:8080/spso/update-paper-type`, { params: { paper: paper } })
      .then(res => { setRender(!render); setModal(true); })
      .catch(err => console.error(err));
  }

  const updateVertical = () =>
  {
    axios.put(`http://${ domain }:8080/spso/update-vertical`, { params: { vertical: !vertical } })
      .then(res => { setRender(!render); setModal(true); })
      .catch(err => console.error(err));
  }

  const updateType = () =>
  {
    setIsWrong(false);
    const temp = types.split(',');
    let isOk = true;
    for (let i = 0; i < temp.length; i++)
    {
      if (temp[i][0] !== '.')
      {
        isOk = false;
        break;
      }
    }
    if (isOk)
      axios.put(`http://${ domain }:8080/spso/update-file-type`, { params: { types: types } })
        .then(res => { setRender(!render); setModal(true); })
        .catch(err => console.error(err));
    else setIsWrong(true);
  }

  return (
    <div className="m-auto rounded-4 d-flex flex-column p-5 gap-4"
      style={ { backgroundColor: "#FFFFFF", width: '90%', height: '90%' } }>
      <div className="mb-2  ">
        <h3>Số lượng trang in cấp cho sinh viên định kỳ</h3>
        <div className="d-flex">
          <ButtonGroup>
            <Button variant="secondary" onClick={ () =>
            {
              if (page > 0)
                setPage(parseInt(page) - 1)
              else
                setPage(0);
            } }>-</Button>
            <input type="number" min="0" className="text-center" style={ { width: '60px  ' } } value={ page } onChange={ e =>
            {
              if (e.target.value < 0 || e.target.value === '')
                setPage(0);
              else
                setPage(e.target.value)
            } }></input>
            <Button variant="secondary" onClick={ () => setPage(parseInt(page) + 1) }>+</Button>
          </ButtonGroup>
          <button className={ `btn btn-primary ms-5` } onClick={ updatePage }>
            Lưu thay đổi
          </button>
        </div>
      </div>
      <div className="mb-2">
        <h3>Ngày cấp định kỳ trang in cho sinh viên</h3>
        <div className="d-flex">
          <input
            style={ { width: "50px" } }
            type="number"
            value={ date }
            onChange={ (e) =>
            {
              if (e.target.value < 1) setDate(1);
              else if (e.target.value > 31) setDate(31);
              else
                setDate(e.target.value)
            } }
            min={ 1 }
            max={ 31 }
            className={ `${ styles["input-field"] }` }
          />
          <button className={ `btn btn-primary ms-5` } onClick={ updateDate }>
            Lưu thay đổi
          </button>
        </div>
      </div>
      <div className="mb-2">
        <h3>In hai mặt</h3>
        <div className="d-flex">
          <div className="form-check form-switch">
            <input className={ `form-check-input ${ styles.switch }` } type="checkbox" checked={ double } onChange={ updateSide }></input>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <h3>In đứng</h3>
        <div className="d-flex">
          <div className="form-check form-switch">
            <input className={ `form-check-input ${ styles.switch }` } type="checkbox" checked={ vertical } onChange={ updateVertical }></input>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <h3>Loại giấy mặc định</h3>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            { paper }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={ () => { updatePaper(0) } }>A0</Dropdown.Item>
            <Dropdown.Item onClick={ () => { updatePaper(1) } }>A1</Dropdown.Item>
            <Dropdown.Item onClick={ () => { updatePaper(2) } }>A2</Dropdown.Item>
            <Dropdown.Item onClick={ () => { updatePaper(3) } }>A3</Dropdown.Item>
            <Dropdown.Item onClick={ () => { updatePaper(4) } }>A4</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
        <h3>Định dạng file được tải lên hệ thống</h3>
        <div className="d-flex">
          <input
            type="text"
            value={ types }
            onChange={ (e) => setTypes(e.target.value) }
            className={ `${ styles["input-field"] }` }
          />
          <button className={ `btn btn-primary ms-5` } onClick={ updateType }>
            Lưu thay đổi
          </button>
        </div>
        { isWrong && <h5 className="text-danger mt-3">Chuỗi sai định dạng! (.type1,.type2...)</h5> }
      </div>

      <Modal
        show={ modal }
        onHide={ () => setModal(false) }
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thành công!</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={ () => setModal(false) }>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default UsageSettings;
