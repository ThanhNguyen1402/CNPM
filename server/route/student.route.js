const express = require('express');
const multer = require('multer');
const upload = multer();
const { uploadFile, getFileList, removeFile, getFileType, getCurrentPage, getPagePrice, buyPaper, getPrinterList, getDefaultPrintConfig, printDocument, getLogList, getBuyLogInfo, getPrintLogInfo } = require('../controller/student.controller');

const studentRoutes = express.Router();

studentRoutes.post('/upload-file', upload.fields([
      { name: 'uploadFile' }
]), uploadFile);
studentRoutes.get('/file-list', getFileList);
studentRoutes.get('/accept-file-type', getFileType);
studentRoutes.delete('/remove-file', removeFile);
studentRoutes.get('/current-page', getCurrentPage);
studentRoutes.get('/page-price', getPagePrice);
studentRoutes.post('/buy-paper', buyPaper);
studentRoutes.get('/printer-list', getPrinterList);
studentRoutes.get('/default-print-config', getDefaultPrintConfig);
studentRoutes.post('/print-document', printDocument);
studentRoutes.get('/get-log-list', getLogList);
studentRoutes.get('/buy-log-info', getBuyLogInfo);
studentRoutes.get('/print-log-info', getPrintLogInfo);

module.exports = studentRoutes;