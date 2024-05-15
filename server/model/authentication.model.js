const mysql2 = require('mysql2');
const POOL = require('../config/pool.config');

const conn = mysql2.createPool(POOL);

function checkUserID(id, callback)
{
      conn.query(`select * from user join student on student.id=user.id where user.id=?`, [id], (err, res) =>
      {
            if (err)
                  callback(null, null, err);
            else
            {
                  if (res.length)
                        callback(res, 1, null);
                  else
                  {
                        conn.query(`select * from user join spso on spso.id=user.id where user.id=?`, [id], (err, res) =>
                        {
                              if (res.length)
                                    callback(res, 2, null);
                              else
                                    callback([], null, null);
                        });
                  }
            }
      });
}

function loginQuery(email, password, callback)
{
      conn.query(`select user.id as ID from user join student on student.id=user.id where user.email=? and user.password=?`, [email, password], (err, res) =>
      {
            if (err)
                  callback(null, null, err);
            else
            {
                  if (res.length)
                        callback(res, 1, null);
                  else
                  {
                        conn.query(`select user.id as ID from user join spso on spso.id=user.id where user.email=? and user.password=?`, [email, password], (err, res) =>
                        {
                              if (res.length)
                                    callback(res, 2, null);
                              else
                                    callback([], null, null);
                        });
                  }
            }
      });
}

module.exports = { checkUserID, loginQuery };