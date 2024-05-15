const express = require('express');
const { getPrinterList, getPrinterInfo, changePrinterState, removePrinter, createPrinter, updatePrinterInfo, getDefaultConfig,
      updatePageNumber, updateDate, updateSide, updatePaperType, updateFileType, updateVertical } = require('../controller/spso.controller');

const spsoRoutes = express.Router();

spsoRoutes.get('/printer-list', getPrinterList);
spsoRoutes.get('/printer-info', getPrinterInfo);
spsoRoutes.put('/change-printer-state', changePrinterState);
spsoRoutes.delete('/remove-printer', removePrinter);
spsoRoutes.post('/create-printer', createPrinter);
spsoRoutes.put('/update-printer-info', updatePrinterInfo);
spsoRoutes.get('/default-configs', getDefaultConfig);
spsoRoutes.put('/update-page-number', updatePageNumber);
spsoRoutes.put('/update-date', updateDate);
spsoRoutes.put('/update-side', updateSide);
spsoRoutes.put('/update-vertical', updateVertical);
spsoRoutes.put('/update-paper-type', updatePaperType);
spsoRoutes.put('/update-file-type', updateFileType);

module.exports = spsoRoutes;