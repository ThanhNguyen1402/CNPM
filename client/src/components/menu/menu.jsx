import styles from './menu.module.css';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CiLogout } from "react-icons/ci";
import { FiPrinter, FiUpload } from "react-icons/fi";
import { CiSettings } from "react-icons/ci";
import { GrDocumentText } from "react-icons/gr";
import { FaHistory } from "react-icons/fa";
import { FcStatistics } from "react-icons/fc";
import axios from 'axios';
import domain from '../../config/domain.config';

export default function Menu()
{
      const [activeTab, setActiveTab] = useState("");
      const [render, setRender] = useState(false);
      const [role, setRole] = useState(0);

      const Navigate = useNavigate();

      useEffect(() =>
      {
            axios.get(`http://${ domain }:8080/`, { withCredentials: true })
                  .then(res =>
                  {
                        if (res.status === 200)
                        {
                              setActiveTab(window.location.pathname);
                              setRole(res.data.userRole);
                              const currentURL = window.location.pathname;
                              if (res.data.userRole === 1)
                              {
                                    if (!currentURL.includes("/print") && !currentURL.includes("/buy") && !currentURL.includes("/upload") && !currentURL.includes("/history"))
                                          Navigate('/forbidden');
                              }
                              else if (res.data.userRole === 2)
                              {
                                    if (!currentURL.includes("/manage_printer") && !currentURL.includes("/setting") && !currentURL.includes("/statistic"))
                                          Navigate('/forbidden');
                              }
                        }
                  })
                  .catch(err =>
                  {
                        console.log(err);
                        if (err.response.status === 400 || err.response.status === 401)
                              Navigate('/');

                  });
      }, [render, Navigate]);

      function logOut()
      {
            axios.delete(`http://${ domain }:8080/logout`, { withCredentials: true })
                  .then(res =>
                  {
                        Navigate('/');
                  })
                  .catch(err => console.error(err));
      }

      return (
            <div className="d-flex flex-column w-100 h-100" style={ { backgroundColor: '#E6E6E6' } }>
                  <div className="w-100 d-flex mb-2 align-items-center justify-content-between" style={ { height: '80px', backgroundColor: "#FFFFFF" } }>
                        <div className="d-flex align-items-center">
                              <img alt="logo BK" src="https://cdn.haitrieu.com/wp-content/uploads/2021/09/Logo-DH-Bach-Khoa-HCMUT.png" className={ `${ styles.logo } ms-4` }></img>
                              <h2 className="mb-0 ms-4">BK Printing</h2>
                        </div>
                        <div className={ `${ styles.hover2 } d-flex justify-content-center me-5` } onClick={ logOut } >
                              <span className={ `d-flex align-items-center p-0` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap' } }><CiLogout className={ `me-2` } />Đăng xuất</span>
                        </div>
                  </div>
                  <div className="w-100 d-flex flex-grow-1">
                        <div className={ `h-100 d-flex flex-column ${ styles.navbar }` }>
                              <div className={ `flex-grow-1 d-flex flex-column overflow-auto ${ styles.tabs }` }>
                                    { role === 1 && <>
                                          <NavLink to={ "/print" } className={ `${ activeTab.includes('/print') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center ps-4 mt-5` } onClick={ () => setRender(!render) }>
                                                <p className={ `d-flex align-items-center justify-content-center p-0 mb-0` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><FiPrinter className={ `me-2` } />In tài liệu</p>
                                          </NavLink>
                                          <NavLink to={ "/upload" } className={ `${ activeTab.includes('/upload') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center ps-4 mt-3` } onClick={ () => setRender(!render) }>
                                                <p className={ `d-flex align-items-center justify-content-center p-0 mb-0` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><FiUpload className={ `me-2` } />Lưu tài liệu</p>
                                          </NavLink>
                                          <NavLink to={ "/buy" } className={ `${ activeTab.includes('/buy') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center ps-4 mt-3` } onClick={ () => setRender(!render) }>
                                                <p className={ `d-flex align-items-center justify-content-center p-0 mb-0` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><GrDocumentText className={ `me-2` } />Mua giấy</p>
                                          </NavLink>
                                          <NavLink to={ "/history" } className={ `${ activeTab.includes('/history') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center ps-4 mt-3` } onClick={ () => setRender(!render) }>
                                                <p className={ `d-flex align-items-center justify-content-center p-0 mb-0` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><FaHistory className={ `me-2` } />Lịch sử</p>
                                          </NavLink>
                                    </> }
                                    { role === 2 && <>
                                          <NavLink to={ "/manage_printer" } className={ `${ activeTab.includes('/manage_printer') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center ps-4 mt-3` } onClick={ () => setRender(!render) }>
                                                <p className={ `d-flex align-items-center justify-content-center p-0 mb-0` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><FiPrinter className={ `me-2` } />Quản lý máy in</p>
                                          </NavLink>
                                          <NavLink to={ "/setting" } className={ `${ activeTab.includes('/setting') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center ps-4 mt-3` } onClick={ () => setRender(!render) }>
                                                <p className={ `d-flex align-items-center justify-content-center p-0 mb-0` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><CiSettings className={ `me-2` } style={ { fontSize: '2rem', } } />Cài đặt</p>
                                          </NavLink>
                                          <NavLink to={ "/statistic" } className={ `${ activeTab.includes('/statistic') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center ps-4 mt-3` } onClick={ () => setRender(!render) }>
                                                <p className={ `d-flex align-items-center justify-content-center p-0 mb-0` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><FcStatistics className={ `me-2` } style={ { fontSize: '2rem', } } />Thống kê</p>
                                          </NavLink>
                                    </> }
                              </div>
                        </div>

                        <div className={ `h-100 d-flex ms-2` } style={ { width: 'calc(100% - 300px)' } }>
                              <Outlet />
                        </div>
                  </div>
            </div>
      )
}