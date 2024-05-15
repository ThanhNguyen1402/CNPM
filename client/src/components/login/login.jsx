import styles from './login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import domain from '../../config/domain.config';

export default function Login()
{
      const [email, setEmail] = useState(null);
      const [password, setPassword] = useState(null);
      const [isWrong, setIsWrong] = useState(false);

      const Navigate = useNavigate();

      const submitForm = (e) =>
      {
            e.preventDefault();

            setIsWrong(false);

            axios.post(`http://${ domain }:8080/login`, { params: { email: email, password: password } }, { withCredentials: true })
                  .then(res =>
                  {
                        if (res.status === 200)
                        {
                              if (res.data.userRole === 1)
                                    Navigate('/print');
                              else if (res.data.userRole === 2)
                                    Navigate('/manage_printer');
                        }
                  })
                  .catch(err =>
                  {
                        console.error(err);
                        if (err.response.status === 401) setIsWrong(true);
                  });
      }

      useEffect(() =>
      {
            axios.get(`http://${ domain }:8080/`, { withCredentials: true })
                  .then(res =>
                  {
                        if (res.status === 200)
                        {
                              if (res.data.userRole === 1)
                                    Navigate('/print');
                              else if (res.data.userRole === 2)
                                    Navigate('/manage_printer');
                        }
                  })
                  .catch(err =>
                  {
                        console.error(err);
                  });
      }, [Navigate])

      return (
            <div className='h-100 w-100 d-flex flex-column' style={ {
                  backgroundImage: "url('https://xdcs.cdnchinhphu.vn/446259493575335936/2023/8/23/bk-16927240565021297712364.jpg')",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover"
            } }>
                  <div className="w-100 d-flex align-items-center" style={ { height: '80px', backgroundColor: "#FFFFFF" } }>
                        <img alt="logo BK" src="https://cdn.haitrieu.com/wp-content/uploads/2021/09/Logo-DH-Bach-Khoa-HCMUT.png" className={ `${ styles.logo } ms-4` }></img>
                  </div>
                  <div className='w-100 d-flex' style={ {
                        height: 'calc(100% - 80px)'
                  } }>
                        <div className={ `shadow border-2 m-auto rounded-5 w-50 h-50` } style={ { backgroundColor: 'rgba(255,255,255,0.6)', maxHeight: '500px', maxWidth: '850px' } }>
                              <form className='d-flex flex-column w-100 h-100' onSubmit={ submitForm }>
                                    <h1 className="text-primary text-center" style={ { fontSize: '4rem' } }>Login</h1>
                                    <div className='w-100 h-75 row'>
                                          <div className='col-8 d-flex flex-column justify-content-evenly align-items-center'>
                                                <div className="form-group w-100 ps-4">
                                                      <label className={ `${ styles.customfield }` }>Email</label>
                                                      <input type="email" className={ `${ styles.customfield } form-control` } required onChange={ e =>
                                                      {
                                                            if (e.target.value === '') setEmail(null);
                                                            else setEmail(e.target.value);
                                                      } } />
                                                </div>
                                                <div className="form-group w-100 ps-4">
                                                      <label className={ `${ styles.customfield }` }>Password</label>
                                                      <input type="password" className={ `${ styles.customfield } form-control` } required onChange={ e =>
                                                      {
                                                            if (e.target.value === '') setPassword(null);
                                                            else setPassword(e.target.value);
                                                      } } />
                                                </div>
                                                {
                                                      isWrong &&
                                                      <h4 className="text-danger">Email hoặc mật khẩu không đúng!</h4>
                                                }
                                          </div>
                                          <div className='col-4 d-flex justify-content-center align-items-center'>
                                                <button type="submit" className="btn btn-primary rounded-4 mt-5" style={ { height: "150px", width: "150px", opacity: '0.7' } }>
                                                      <FontAwesomeIcon icon={ faArrowRight } style={ { color: "#0400ff", height: '75px' } } />
                                                </button>
                                          </div>
                                    </div>
                              </form>
                        </div>
                  </div>
            </div>
      )
}