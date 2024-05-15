const path = require('path');
const fs = require('fs');
const { queryUploadFile, queryFileList, queryRemoveFile, queryFileType, getCurrentPageQuery, getPagePriceQuery, buyPaperQuery, queryGetPrinterList, getDefaultPrintConfigQuery,
      printDocumentQuery, getLogListQuery, getBuyLogInfoQuery, getPrintLogInfoQuery } = require('../model/student.model');

function uploadFile(req, res)
{
      const uploadFile = req.files["uploadFile"][0];
      const directory = path.join(__dirname, '..', 'data', 'file', req.session.userID);
      if (!fs.existsSync(directory))
            fs.mkdirSync(directory, { recursive: true });
      const existingFileName = fs.readdirSync(directory).filter(file => file.includes(req.body.fileName.split('.')[0]));
      let finalFileName, finalPath;
      if (existingFileName.length)
      {
            finalFileName = `${ req.body.fileName.split('.')[0] } (${ existingFileName.length }).${ req.body.fileName.split('.')[1] }`;
            finalPath = `${ req.session.userID }/${ req.body.fileName.split('.')[0] } (${ existingFileName.length }).${ req.body.fileName.split('.')[1] }`;
            fs.writeFileSync(path.join(directory, `${ req.body.fileName.split('.')[0] } (${ existingFileName.length }).${ req.body.fileName.split('.')[1] }`), uploadFile.buffer);
      }
      else
      {
            finalFileName = req.body.fileName;
            finalPath = `${ req.session.userID }/${ req.body.fileName }`;
            fs.writeFileSync(path.join(directory, req.body.fileName), uploadFile.buffer);
      }
      let size = req.body.fileSize;
      let sizeUnit = 'B';
      if (size > 1024)
      {
            size /= 1024;
            sizeUnit = 'KB';
      }
      if (size > 1024)
      {
            size /= 1024;
            sizeUnit = 'MB';
      }
      if (size > 1024)
      {
            size /= 1024;
            sizeUnit = 'GB';
      }
      size = size.toFixed(2);

      queryUploadFile(req.session.userID, finalFileName, size + ' ' + sizeUnit, finalPath, req.body.time, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
                  res.status(200).send({ message: "File uploaded!" });
      });
}

function getFileList(req, res)
{
      const name = req.query.name;
      queryFileList(req.session.userID, name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
                  res.status(200).send(result);
      });
}

function removeFile(req, res)
{
      queryRemoveFile(req.session.userID, req.query.fileID, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  if (result[0].length)
                  {
                        const filePath = result[0][0].path;
                        if (filePath)
                        {
                              const fileLocation = path.join(__dirname, '..', 'data', 'file', filePath);
                              fs.unlinkSync(fileLocation);
                              res.status(200).send({ message: "File removed successfully!" });
                        }
                        else
                              res.status(500);
                  }
                  else
                        res.status(500);
            }
      });
}

function getFileType(req, res)
{
      queryFileType((result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else res.status(200).send(result);
      });
}

function getCurrentPage(req, res)
{
      getCurrentPageQuery(req.session.userID, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else res.status(200).send(result);
      })
}

function getPagePrice(req, res)
{
      getPagePriceQuery((result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else res.status(200).send(result);
      });
}

function buyPaper(req, res)
{
      buyPaperQuery(req.session.userID, req.body.params.paper, req.body.params.number, req.body.params.cost, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else res.status(200).send({ message: "Paper bought!" });
      })
}

function getPrinterList(req, res)
{
      const search = req.query.search;
      queryGetPrinterList(search, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send(result);
            }
      });
}

function getDefaultPrintConfig(req, res)
{
      getDefaultPrintConfigQuery((result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send(result);
            }
      });
}

function printDocument(req, res)
{
      printDocumentQuery(req.session.userID, req.body.params.file, req.body.params.printer, req.body.params.config, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send({ message: "Printing complete!" });
            }
      });
}

function getLogList(req, res)
{
      getLogListQuery(req.session.userID, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send(result);
            }
      });
}

function getBuyLogInfo(req, res)
{
      getBuyLogInfoQuery(req.query.id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send(result);
            } 
      });
}

function getPrintLogInfo(req, res)
{
      getPrintLogInfoQuery(req.query.id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send(result);
            }
      });
}

module.exports = { uploadFile, getFileList, removeFile, getFileType, getCurrentPage, getPagePrice, buyPaper, getPrinterList, getDefaultPrintConfig, printDocument, getLogList, getBuyLogInfo, getPrintLogInfo };