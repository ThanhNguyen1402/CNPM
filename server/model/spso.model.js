const mysql2 = require('mysql2');
const POOL = require('../config/pool.config');

const conn = mysql2.createPool(POOL);

function queryGetPrinterList(search, callback)
{
      conn.query(`select id from printer where name like ? or model like ? or location like ? order by cast(substr(id,9) AS UNSIGNED)`, ['%' + search + '%', '%' + search + '%', '%' + search + '%'], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function queryGetPrinterInfo(id, callback)
{
      conn.query(`select name,model,location,status,description from printer where id=?`, [id], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function queryChangePrinterState(id, newState, callback)
{
      conn.query(`update printer set status=? where id=?`, [newState, id], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function queryRemovePrinter(id, callback)
{
      conn.query(`delete from printer where id=?`, [id], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function queryCreatePrinter(name, model, location, description, callback)
{
      conn.query(`insert into printer(name,model,location,description) values(?,?,?,?)`, [name, model, location, description], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function queryUpdatePrinterInfo(id, name, model, location, description, callback)
{
      let sql = ``;
      const params = [];

      if (name)
      {
            sql += `update printer set name=? where id=?;`
            params.push(name, id);
      }

      if (model)
      {
            sql += `update printer set model=? where id=?;`
            params.push(model, id);
      }

      if (description)
      {
            sql += `update printer set description=? where id=?;`
            params.push(description, id);
      }

      if (location)
      {
            sql += `update printer set location=? where id=?;`
            params.push(location, id);
      }

      conn.query(sql, params, (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function getDefaultConfigQuery(callback)
{
      conn.query(`select * from defaultConfig; select * from permittedFile; select * from distributeConfig;`, [], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function updatePageNumberQuery(number, callback)
{
      conn.query(`update distributeConfig set numberOfPage=? where id='ID'`, [number], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function updateDateQuery(date, callback)
{
      conn.query(`update distributeConfig set date=? where id='ID'`, [date], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function updateSideQuery(side, callback)
{
      conn.query(`update defaultConfig set doubleSide=? where id='ID'`, [side], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function updateVerticalQuery(vertical, callback)
{
      conn.query(`update defaultConfig set vertical=? where id='ID'`, [vertical], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function updatePaperTypeQuery(type, callback)
{
      conn.query(`update defaultConfig set paperType=? where id='ID'`, ['A' + type], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}


function updateFileTypeQuery(types, callback)
{
      let sql = `delete from permittedFile;`;
      const params = [];
      for (let i = 0; i < types.length; i++)
      {
            sql += `insert into permittedFile values(?);`;
            params.push(types[i]);
      }
      conn.query(sql, params, (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}


module.exports = {
      queryGetPrinterList, queryGetPrinterInfo, queryChangePrinterState, queryRemovePrinter, queryCreatePrinter, queryUpdatePrinterInfo, getDefaultConfigQuery,
      updatePageNumberQuery, updateDateQuery, updateSideQuery, updatePaperTypeQuery, updateFileTypeQuery, updateVerticalQuery
};