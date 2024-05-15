import { useEffect, useState } from 'react';
import axios from 'axios';
import domain from '../../../config/domain.config';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function BuyPaper()
{
      const [page, setPage] = useState(1);
      const [myPages, setMyPages] = useState(null);
      const [pageType, setPageType] = useState("A4");
      const [prices, setPrices] = useState(null);

      const [render, setRender] = useState(false);
      const [modal, setModal] = useState(false);

      useEffect(() =>
      {
            axios.get(`http://${ domain }:8080/student/current-page`, { withCredentials: true })
                  .then(res =>
                  {
                        setMyPages({ A0: res.data[0].A0papers, A1: res.data[0].A1papers, A2: res.data[0].A2papers, A3: res.data[0].A3papers, A4: res.data[0].A4papers });
                  })
            axios.get(`http://${ domain }:8080/student/page-price`)
                  .then(res =>
                  {
                        setPrices({ A0: res.data[0].cost, A1: res.data[1].cost, A2: res.data[2].cost, A3: res.data[3].cost, A4: res.data[4].cost });
                  })
      }, [render]);

      const purchase = () =>
      {
            axios.post(`http://${ domain }:8080/student/buy-paper`, { params: { paper: pageType, number: page, cost: page * prices[pageType] } }, { withCredentials: true })
                  .then(res =>
                  {
                        setRender(!render);
                        setModal(true);
                  })
                  .catch(err => console.error(err));
      }

      return (
            <div className='d-flex flex-column w-75 h-75 bg-white shadow m-auto rounded-4'>
                  <div className='mt-5 ms-3 d-flex flex-column'>
                        <strong className='my-2'>Số lượng trang A0 hiện tại: { myPages && myPages.A0 }</strong>
                        <strong className='my-2'>Số lượng trang A1 hiện tại: { myPages && myPages.A1 }</strong>
                        <strong className='my-2'>Số lượng trang A2 hiện tại: { myPages && myPages.A2 }</strong>
                        <strong className='my-2'>Số lượng trang A3 hiện tại: { myPages && myPages.A3 }</strong>
                        <strong className='mt-2'>Số lượng trang A4 hiện tại: { myPages && myPages.A4 }</strong>
                  </div>

                  <div className='mt-3 ms-2'>
                        <button className='btn btn-primary' disabled>Thêm đơn</button>
                  </div>

                  <div className='card text-center m-2'>
                        <div className='d-flex justify-content-around flex-grow-1'>
                              <div className='text-center pb-2'>
                                    <h4>Cỡ giấy</h4>
                                    <select
                                          className="form-control"
                                          style={ { width: 80 } }
                                          onChange={ e => setPageType(e.target.value) }
                                          defaultValue={ pageType }
                                    >
                                          <option >A0</option>
                                          <option>A1</option>
                                          <option>A2</option>
                                          <option>A3</option>
                                          <option>A4</option>
                                    </select>
                              </div>
                              <div>
                                    <h4>Số lượng</h4>
                                    <ButtonGroup>
                                          <button className='btn btn-secondary' onClick={ () =>
                                          {
                                                if (page <= 1)
                                                      setPage(1);
                                                else
                                                      setPage(parseInt(page) - 1);
                                          } }>
                                                -
                                          </button>
                                          <input type='number' min={ 1 } className='ml-1 mr-1 text-center' style={ { width: '60px' } } value={ page }
                                                onChange={ e =>
                                                {
                                                      if (e.target.value < 1 || e.target.value === '')
                                                            setPage(1);
                                                      else
                                                            setPage(e.target.value);
                                                } }></input>
                                          <button className='btn btn-secondary' onClick={ () => setPage(parseInt(page) + 1) }>
                                                +
                                          </button>
                                    </ButtonGroup>

                              </div>
                              <div>
                                    <h4>Giá tiền</h4>
                                    <p className='mb-0'>{ prices && prices[pageType] }đ</p>
                              </div>
                              <div>
                                    <h4>Thành tiền</h4>
                                    <p className='mb-0'>{ prices && page * prices[pageType] }đ</p>
                              </div>
                        </div>
                  </div>

                  <div className='d-flex flex-column m-2'>
                        <div className='d-flex justify-content-end'>
                              <strong>Tổng tiền: { prices && page * prices[pageType] }đ</strong>
                        </div>
                        <div className='d-flex justify-content-end'>
                              <button className='btn btn-success' onClick={ purchase }>
                                    Thanh Toán
                              </button>
                        </div>
                  </div>

                  <Modal
                        show={ modal }
                        onHide={ () => setModal(false) }
                  >
                        <Modal.Header closeButton>
                              <Modal.Title>Mua thêm giấy thành công!</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                              <Button variant="primary" onClick={ () => setModal(false) }>
                                    Xác nhận
                              </Button>
                        </Modal.Footer>
                  </Modal>
            </div>
      )
}