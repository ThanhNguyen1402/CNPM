import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from './components/login/login';
import Menu from './components/menu/menu';

import UploadFile from './components/student/upload file/UploadFile';
import BuyPaper from './components/student/buy paper/buy';
import Print from './components/student/print/print';
import History from './components/student/history/history';

import UsageSettings from './components/spso/usage settings/UsageSettings';
import Printers from './components/spso/printers/Printers';
import Statistic from './components/spso/statistic/statistic';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import domain from './config/domain.config';

function NotFound()
{
  return (
    <div className="w-100 h-100 d-flex">
      <h1 className="m-auto">404 NOT FOUND!</h1>
    </div>
  )
}

function Forbidden()
{
  const Navigate = useNavigate();

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="m-auto">
        <h1>403 FORBIDDEN!</h1>
        <div className='d-flex align-items-center'>
          <p className='mb-0 me-2'>Change the current URL or </p>
          <button className='btn btn-secondary' onClick={ () =>
          {
            axios.delete(`http://${ domain }:8080/logout`, { withCredentials: true })
              .then(res =>
              {
                Navigate('/');
              })
              .catch(err => console.error(err));
          } }>Log out</button>
        </div>
      </div>
    </div>
  )
}

function App()
{
  return (
    <div className="App">
      <Routes>
        <Route index Component={ Login } />
        <Route Component={ Menu }>
          <Route path='/upload' Component={ UploadFile } />
          <Route path='/buy' Component={ BuyPaper } />
          <Route path='/setting' Component={ UsageSettings } />
          <Route path='/manage_printer' Component={ Printers } />
          <Route path='/print' Component={ Print } />
          <Route path='/history' Component={ History } />
          <Route path='/statistic' Component={ Statistic } />
        </Route>
        <Route path='forbidden' Component={ Forbidden } />
        <Route path='*' Component={ NotFound } />
      </Routes>
    </div>
  );
}

export default App;
