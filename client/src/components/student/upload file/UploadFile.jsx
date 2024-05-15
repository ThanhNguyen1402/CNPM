import { useEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import styles from './UploadFile.module.css';
import { FaRegTrashAlt } from "react-icons/fa";
import axios from 'axios';
import domain from '../../../config/domain.config';
import { formatDateTime } from '../../../tool/dateFormatter.tool';
import { getCurrentDateTime } from '../../../tool/currentDate.tool';

const File = (props) =>
{
      const deleteFile = () =>
      {
            axios.delete(`http://${ domain }:8080/student/remove-file`, { params: { fileID: props.id }, withCredentials: true })
                  .then(res => props.setRender(!props.render))
                  .catch(err =>
                  {
                        props.setRender(!props.render);
                        console.error(err);
                  });
      }

      return (
            <div className="d-flex align-items-center row w-100">
                  <p className="col-5">{ props.name }</p>
                  <p className="col-3 text-center">{ formatDateTime(props.uploadTime) }</p>
                  <p className="col-3 text-center">{ props.size }</p>
                  <div className="col-1 text-center mb-3"><FaRegTrashAlt className={ `${ styles.delete }` } onClick={ deleteFile } /></div>
            </div>
      )
}

export default function UploadFile()
{
      const [files, setFiles] = useState([]);
      const [searchName, setSearchName] = useState("");
      const [render, setRender] = useState(false);
      const [acceptType, setAcceptType] = useState("");

      const fileInput = useRef(null);

      const container = useRef(null);
      const div1 = useRef(null);
      const div2 = useRef(null);
      const [maxHeight, setMaxHeight] = useState(0);

      let timer;

      useEffect(() =>
      {
            if (container.current && div1.current && div2.current)
            {
                  setMaxHeight(`${ container.current.offsetHeight - div1.current.offsetHeight - div2.current.offsetHeight - 20 }px`);
            }
            axios.get(`http://${ domain }:8080/student/file-list`, { params: { name: searchName }, withCredentials: true })
                  .then(res =>
                  {
                        setFiles(res.data);
                  })
                  .catch(err => console.error(err));

            axios.get(`http://${ domain }:8080/student/accept-file-type`)
                  .then(res =>
                  {
                        let temp = '';
                        for (let i = 0; i < res.data.length; i++)
                        {
                              temp += res.data[i].fileType + ',';
                        }
                        setAcceptType(temp.substring(0, temp.length - 1));
                  })
                  .catch(err => console.error(err));
      }, [render, searchName])

      return (
            <div className="m-auto rounded border border-2 border-dark d-flex flex-column align-items-center overflow-auto" style={ { backgroundColor: '#FFFFFF', width: '90%', height: '90%' } }>
                  <h2 className="mt-5">Chọn tệp tin</h2>
                  <button className={ `d-block rounded-5 mt-5 mb-5 border border-1 border-secondary ${ styles.button }` } onClick={ () =>
                  {
                        if (fileInput.current)
                              fileInput.current.click();
                  } }>
                        <FiDownload style={ { width: '5rem', height: '5rem' } } />
                  </button>
                  <input type="file" accept={ acceptType } className="d-none" onChange={ async (e) =>
                  {
                        const current = getCurrentDateTime();
                        for (let i = 0; i < e.target.files.length; i++)
                        {
                              const formdata = new FormData();
                              formdata.append('uploadFile', e.target.files[i]);
                              formdata.append('fileName', e.target.files[i].name);
                              formdata.append('fileSize', e.target.files[i].size);
                              formdata.append('time', current);
                              await axios.post(`http://${ domain }:8080/student/upload-file`, formdata, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
                        }
                        setRender(!render);
                        e.target.value = null;
                  } } ref={ fileInput } multiple></input>
                  <div className="w-75 border border-1 border-dark rounded mt-5 mb-5 d-flex flex-column h-50" style={ { backgroundColor: '#E6E6E6' } } ref={ container }>
                        <div className=" mt-3 ms-4 d-flex align-items-center" style={ { fontSize: '1.2rem' } } ref={ div1 }>
                              <input type="text" className="ps-4" onChange={ e =>
                              {
                                    clearTimeout(timer);
                                    timer = setTimeout(() => setSearchName(e.target.value), 1000);
                              } }></input>
                              <FaMagnifyingGlass className="position-absolute ms-1" />
                        </div>
                        <div style={ { width: '95%' } } className="d-flex align-self-center mt-3" ref={ div2 }>
                              <div className="w-100 row d-flex align-items-center">
                                    <strong className="col-5">Tên tệp</strong>
                                    <strong className="col-3 text-center">Thời gian lưu</strong>
                                    <strong className="col-3 text-center">Kích thước tệp</strong>
                              </div>
                        </div>
                        <hr className="mt-0"></hr>
                        <div className="mx-auto mb-1 overflow-auto flex-grow-1" style={ { width: '95%', minHeight: '150px', maxHeight: maxHeight } }>
                              {
                                    !!files.length && files.map((file, index) => <File key={ index } name={ file.name } size={ file.fileSize }
                                          id={ file.id } uploadTime={ file.uploadTime } setRender={ setRender } render={ render } />)
                              }
                        </div>
                  </div>
            </div>
      )
}