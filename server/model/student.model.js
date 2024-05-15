const mysql2 = require('mysql2');
const POOL = require('../config/pool.config');

const conn = mysql2.createPool(POOL);

function queryUploadFile(id, name, size, path, time, callback)
{
      conn.query(`insert into file(name,fileSize,studentId,path,uploadTime) values(?,?,?,?,?);`, [name, size, id, path, time], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function queryFileList(id, name, callback)
{
      conn.query(`select id,name,fileSize,uploadTime from file where studentId=? and name like ? order by uploadTime desc,cast(substr(id,6) AS UNSIGNED)`, [id, '%' + name + '%'], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function queryRemoveFile(id, fileID, callback)
{
      conn.query(`select path from file where studentId=? and id=?;
      delete from file where studentId=? and id=?;`, [id, fileID, id, fileID], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function queryFileType(callback)
{
      conn.query(`select fileType from permittedFile`, [], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function getCurrentPageQuery(id, callback)
{
      conn.query(`select A0papers,A1papers,A2papers,A3papers,A4papers from student where id=?`, [id], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function getPagePriceQuery(callback)
{
      conn.query(`select * from paperCost order by id`, [], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function buyPaperQuery(id, page, number, cost, callback)
{
      if (page === "A0")
            conn.query(`update student set A0papers=A0papers+? where id=?;
      insert buyLog(paperType,numberOfPaper,cost,studentId) values(?,?,?,?);`, [number, id, page, number, cost, id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      else if (page === "A1")
            conn.query(`update student set A1papers=A1papers+? where id=?;
      insert buyLog(paperType,numberOfPaper,cost,studentId) values(?,?,?,?);`, [number, id, page, number, cost, id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      else if (page === "A2")
            conn.query(`update student set A2papers=A2papers+? where id=?;
      insert buyLog(paperType,numberOfPaper,cost,studentId) values(?,?,?,?);`, [number, id, page, number, cost, id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      else if (page === "A3")
            conn.query(`update student set A3papers=A3papers+? where id=?;
      insert buyLog(paperType,numberOfPaper,cost,studentId) values(?,?,?,?);`, [number, id, page, number, cost, id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      else if (page === "A4")
            conn.query(`update student set A4papers=A4papers+? where id=?;
      insert buyLog(paperType,numberOfPaper,cost,studentId) values(?,?,?,?);`, [number, id, page, number, cost, id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
}

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

function getDefaultPrintConfigQuery(callback)
{
      conn.query(`select * from defaultConfig`, [], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function printDocumentQuery(id, file, printer, config, callback)
{
      let total = config.to - config.from + 1;
      if (config.doubleSide)
            total = Math.round(total / 2);
      total *= config.copy;
      if (config.paperType === "A0")
            conn.query(`update student set A0papers=A0papers-? where id=?;
insert into printLog(paperType,totalPaper,doubleSide,vertical,printerName,printerLocation,fileName,studentId)
      values(?,?,?,?,(select name from printer where id=?),(select location from printer where id=?),
      (select name from file where id=? and studentId=?),?);`,
                  [total, id, config.paperType, total, config.doubleSide === 1, config.vertical === 1, printer, printer, file, id, id], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
      else if (config.paperType === "A1")
            conn.query(`update student set A1papers=A1papers-? where id=?;
insert into printLog(paperType,totalPaper,doubleSide,vertical,printerName,printerLocation,fileName,studentId)
      values(?,?,?,?,(select name from printer where id=?),(select location from printer where id=?),
      (select name from file where id=? and studentId=?),?);`,
                  [total, id, config.paperType, total, config.doubleSide === 1, config.vertical === 1, printer, printer, file, id, id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      else if (config.paperType === "A2")
            conn.query(`update student set A2papers=A2papers-? where id=?;
      insert into printLog(paperType,totalPaper,doubleSide,vertical,printerName,printerLocation,fileName,studentId)
      values(?,?,?,?,(select name from printer where id=?),(select location from printer where id=?),
      (select name from file where id=? and studentId=?),?);`,
                  [total, id, config.paperType, total, config.doubleSide === 1, config.vertical === 1, printer, printer, file, id, id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      else if (config.paperType === "A3")
            conn.query(`update student set A3papers=A3papers-? where id=?;
insert into printLog(paperType,totalPaper,doubleSide,vertical,printerName,printerLocation,fileName,studentId)
      values(?,?,?,?,(select name from printer where id=?),(select location from printer where id=?),
      (select name from file where id=? and studentId=?),?);`,
                  [total, id, config.paperType, total, config.doubleSide === 1, config.vertical === 1, printer, printer, file, id, id], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
      else if (config.paperType === "A4")
            conn.query(`update student set A4papers=A4papers-? where id=?;
insert into printLog(paperType,totalPaper,doubleSide,vertical,printerName,printerLocation,fileName,studentId)
      values(?,?,?,?,(select name from printer where id=?),(select location from printer where id=?),
      (select name from file where id=? and studentId=?),?);`,
                  [total, id, config.paperType, total, config.doubleSide === 1, config.vertical === 1, printer, printer, file, id, id], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
}

function getLogListQuery(id, callback)
{
      conn.query(`SELECT id, time
FROM (
    SELECT eventLog.id, eventLog.logtime AS time
    FROM eventLog
    JOIN printLog ON printLog.id = eventLog.id
    WHERE printLog.studentId = ?
    
    UNION
    
    SELECT eventLog.id, eventLog.logtime AS time
    FROM eventLog
    JOIN buyLog ON buyLog.id = eventLog.id
    WHERE buyLog.studentId = ?
) AS subquery
ORDER BY time DESC, id;`, [id, id], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function getBuyLogInfoQuery(id, callback)
{
      conn.query(`select paperType,numberOfPaper,cost from buyLog where id=?`, [id], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}

function getPrintLogInfoQuery(id, callback)
{
      conn.query(`select paperType,totalPaper,doubleSide,vertical,printerName,printerLocation,fileName from printLog where id=?`, [id], (err, res) =>
      {
            if (err)
                  callback(null, err);
            else
                  callback(res, null);
      });
}


module.exports = {
      queryUploadFile, queryFileList, queryRemoveFile, queryFileType, getCurrentPageQuery, getPagePriceQuery, buyPaperQuery, queryGetPrinterList, getDefaultPrintConfigQuery,
      printDocumentQuery, getLogListQuery, getBuyLogInfoQuery, getPrintLogInfoQuery
};