import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaMagnifyingGlass } from "react-icons/fa6";
import axios from 'axios';
import domain from '../../../config/domain.config';

const Printer = (props) =>
{
  const [render, setRender] = useState(true);
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
  }, [render, props.id]);

  const changeState = () =>
  {
    axios.put(`http://${ domain }:8080/spso/change-printer-state`, { params: { newState: !status } }, { params: { id: props.id } })
      .then(res =>
      {
        setRender(!render);
      })
      .catch(err => console.error(err));
  }

  return (
    <tr key={ props.id }>
      <td className="align-middle" style={ { height: '100px' } }>{ props.index }</td>
      <td className="align-middle" style={ { height: '100px' } }>{ name }</td>
      <td className="align-middle" style={ { height: '100px' } }>{ model }</td>
      <td className="align-middle" style={ { height: '100px' } }>{ room }</td>
      <td className="align-middle" style={ { height: '100px' } }>{ building }</td>
      <td className="align-middle" style={ { height: '100px' } }>{ campus }</td>
      <td className="align-middle" style={ { color: status ? '#006400' : '#D2122E', } }>{ status ? "Đang hoạt động" : "Ngừng hoạt động" }</td>
      <td className="align-middle" style={ { whiteSpace: 'nowrap', height: '100px' } }>{ description }</td>
      <td className="d-flex align-items-center" style={ { height: '100px' } }>
        <Form.Check
          type="switch"
          checked={ status }
          onClick={ changeState }
        />
        <button className="btn btn-sm btn-danger" onClick={ () => { props.setDeleteID(props.id); props.setDeleteModal(true); } }>Xóa</button>
        <button className="btn btn-sm btn-primary ms-2" onClick={ () =>
        {
          props.setEditId(props.id);
          props.setEditName(name);
          props.setEditModel(model);
          props.setEditRoom(room);
          props.setEditBuilding(building);
          props.setEditCampus(campus);
          props.setEditDescription(description === "N/A" ? null : description);
          props.setOldRoom(room);
          props.setOldBuilding(building);
          props.setOldCampus(campus);
          props.setEditModal(true);
        } }>Sửa</button>
      </td>
    </tr>
  )
}

const Printers = () =>
{
  const [isAddForm, setIsAddForm] = useState(false);
  const [render, setRender] = useState(true);
  const [printers, setPrinters] = useState([]);
  const [name, setName] = useState(null);
  const [model, setModel] = useState(null);
  const [campus, setCampus] = useState(null);
  const [building, setBuilding] = useState(null);
  const [room, setRoom] = useState(null);
  const [description, setDescription] = useState(null);
  const [error, setError] = useState(false);

  const [deleteID, setDeleteID] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const [search, setSearch] = useState("");

  let timer;

  useEffect(() =>
  {
    axios.get(`http://${ domain }:8080/spso/printer-list`, { params: { search: search } })
      .then(res =>
      {
        setPrinters(res.data);
      })
      .catch(err => console.error(err));
  }, [render, search]);

  const createNewPrinter = () =>
  {
    if (!name || !model || !building || !room || !campus) setError(true);
    else
    {
      setError(false);
      setIsAddForm(false);
      axios.post(`http://${ domain }:8080/spso/create-printer`, { params: { name: name, model: model, location: `${ room }/${ building }/${ campus }`, description: description } })
        .then(res =>
        {
          setRender(!render);
        })
        .catch(err => console.error(err));
      setName(null);
      setModel(null);
      setRoom(null);
      setBuilding(null);
      setCampus(null);
      setDescription(null);
    }
  }

  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState(null);
  const [editModel, setEditModel] = useState(null);
  const [editRoom, setEditRoom] = useState(null);
  const [editBuilding, setEditBuilding] = useState(null);
  const [editCampus, setEditCampus] = useState(null);
  const [editDescription, setEditDescription] = useState(null);
  const [oldRoom, setOldRoom] = useState(null);
  const [oldBuilding, setOldBuilding] = useState(null);
  const [oldCampus, setOldCampus] = useState(null);

  const updatePrinter = () =>
  {

    axios.put(`http://${ domain }:8080/spso/update-printer-info`, {
      params: {
        name: editName,
        model: editModel,
        description: editDescription,
        location: `${ editRoom ? editRoom : oldRoom }/${ editBuilding ? editBuilding : oldBuilding }/${ editCampus ? editCampus : oldCampus }`
      }
    }, { params: { id: editId } })
      .then(res =>
      {
        setPrinters([]);
        setRender(!render);
      })
      .catch(err => console.error(err));
    setEditModal(false);
    setEditId(null);
    setEditName(null);
    setEditModel(null);
    setEditRoom(null);
    setEditBuilding(null);
    setEditCampus(null);
    setEditDescription(null);
    setOldRoom(null);
    setOldBuilding(null);
    setOldCampus(null);
  }

  return (
    <div
      className="m-auto rounded d-flex flex-column p-4"
      style={ { backgroundColor: "#FFFFFF", width: "99%", height: "99%" } }
    >
      <div className="mb-2">
        <button
          className={ `btn btn-sm btn-primary` }
          onClick={ () => setIsAddForm(true) }
        >
          + Máy in
        </button>
      </div>

      <div className="mt-3 mb-3 d-flex align-items-center" style={ { fontSize: '1.2rem' } } >
        <input type="text" className="ps-4" placeholder="Tìm kiếm" onChange={ e =>
        {
          clearTimeout(timer);
          timer = setTimeout(() => setSearch(e.target.value), 200);
        } }></input>
        <FaMagnifyingGlass className="position-absolute ms-1" />
      </div>

      <div className={ `w-100 overflow-auto` } style={ { maxHeight: '700px' } }>
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="col-1">STT</th>
              <th className="col-1">Tên</th>
              <th className="col-1">Mẫu mã</th>
              <th className="col-1">Phòng</th>
              <th className="col-1">Tòa</th>
              <th className="col-2">Cơ sở</th>
              <th className="col-1">Trạng thái</th>
              <th className="col-2">Mô tả</th>
              <th className="col-2">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            { printers.map((printer, index) =>
              <Printer key={ printer.id } index={ index + 1 } id={ printer.id }
                setDeleteID={ setDeleteID } setDeleteModal={ setDeleteModal }
                setEditModal={ setEditModal } setEditId={ setEditId } setEditName={ setEditName } setEditModel={ setEditModel }
                setEditRoom={ setEditRoom } setEditBuilding={ setEditBuilding } setEditCampus={ setEditCampus } setEditDescription={ setEditDescription }
                setOldRoom={ setOldRoom } setOldBuilding={ setOldBuilding } setOldCampus={ setOldCampus } />
            ) }
          </tbody>
        </table>
      </div>

      <Modal show={ isAddForm } onHide={ () => setIsAddForm(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Thêm máy in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container mb-3 d-flex flex-column">
            <div className="row mb-2">
              <div className="col">Tên</div>
              <div className="col">
                <input type="text" placeholder="Nhập tên máy" value={ name ? name : "" } onChange={ e =>
                {
                  if (e.target.value === "") setName(null);
                  else setName(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Mẫu mã</div>
              <div className="col">
                <input type="text" placeholder="Nhập mẫu máy" value={ model ? model : "" } onChange={ e =>
                {
                  if (e.target.value === "") setModel(null);
                  else setModel(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Phòng</div>
              <div className="col">
                <input type="text" placeholder="Nhập phòng" value={ room ? room : "" } onChange={ e =>
                {
                  if (e.target.value === "") setRoom(null);
                  else setRoom(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Tòa</div>
              <div className="col">
                <input type="text" placeholder="Nhập tòa nhà" value={ building ? building : "" } onChange={ e =>
                {
                  if (e.target.value === "") setBuilding(null);
                  else setBuilding(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Cơ sở</div>
              <div className="col">
                <input type="text" placeholder="Nhập cơ sở" value={ campus ? campus : "" } onChange={ e =>
                {
                  if (e.target.value === "") setCampus(null);
                  else setCampus(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Mô tả</div>
              <div className="col">
                <input type="text" placeholder="Nhập mô tả hoặc để trống" value={ description ? description : "" } onChange={ e =>
                {
                  if (e.target.value === "") setDescription(null);
                  else setDescription(e.target.value);
                } } />
              </div>
            </div>
            { error && <p className="row mb-2 text-danger align-self-center mt-3">
              Một hoặc nhiều trường đang trống!
            </p> }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={ () =>
          {
            setIsAddForm(false);
            setName(null);
            setModel(null);
            setRoom(null);
            setBuilding(null);
            setCampus(null);
            setDescription(null);
          } }>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={ createNewPrinter }>
            Lưu
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={ editModal } onHide={ () =>
      {
        setEditModal(false);
        setEditId(null);
        setEditName(null);
        setEditModel(null);
        setEditRoom(null);
        setEditBuilding(null);
        setEditCampus(null);
        setEditDescription(null);
        setOldRoom(null);
        setOldBuilding(null);
        setOldCampus(null);
      } }>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa máy in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container mb-3 d-flex flex-column">
            <div className="row mb-2">
              <div className="col">Tên</div>
              <div className="col">
                <input type="text" placeholder="Nhập tên máy" value={ editName ? editName : "" } onChange={ e =>
                {
                  if (e.target.value === "") setEditName(null);
                  else setEditName(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Mẫu mã</div>
              <div className="col">
                <input type="text" placeholder="Nhập mẫu máy" value={ editModel ? editModel : "" } onChange={ e =>
                {
                  if (e.target.value === "") setEditModel(null);
                  else setEditModel(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Phòng</div>
              <div className="col">
                <input type="text" placeholder="Nhập phòng" value={ editRoom ? editRoom : "" } onChange={ e =>
                {
                  if (e.target.value === "") setEditRoom(null);
                  else setEditRoom(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Tòa</div>
              <div className="col">
                <input type="text" placeholder="Nhập tòa nhà" value={ editBuilding ? editBuilding : "" } onChange={ e =>
                {
                  if (e.target.value === "") setEditBuilding(null);
                  else setEditBuilding(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Cơ sở</div>
              <div className="col">
                <input type="text" placeholder="Nhập cơ sở" value={ editCampus ? editCampus : "" } onChange={ e =>
                {
                  if (e.target.value === "") setEditCampus(null);
                  else setEditCampus(e.target.value);
                } } />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Mô tả</div>
              <div className="col">
                <input type="text" placeholder="Nhập mô tả hoặc để trống" value={ editDescription ? editDescription : "" } onChange={ e =>
                {
                  if (e.target.value === "") setEditDescription(null);
                  else setEditDescription(e.target.value);
                } } />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={ () =>
          {
            setEditModal(false);
            setEditId(null);
            setEditName(null);
            setEditModel(null);
            setEditRoom(null);
            setEditBuilding(null);
            setEditCampus(null);
            setEditDescription(null);
            setOldRoom(null);
            setOldBuilding(null);
            setOldCampus(null);
          } }>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={ updatePrinter }>
            Lưu
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={ deleteModal } onHide={ () => { setIsAddForm(false); setDeleteID(null); } }>
        <Modal.Header closeButton>
          <Modal.Title>Bạn có muốn xóa máy in này không?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={ () =>
          {
            setDeleteModal(false);
            setDeleteID(null);
          } }>
            Hủy
          </button>
          <button className="btn btn-danger" onClick={ () =>
          {
            axios.delete(`http://${ domain }:8080/spso/remove-printer`, { params: { id: deleteID } })
              .then(res =>
              {
                setRender(!render);
              })
              .catch(err => console.error(err));
            setDeleteModal(false);
            setDeleteID(null);
          } }>
            Xác nhận
          </button>
        </Modal.Footer>
      </Modal>
    </div >
  );
};
export default Printers;
