const { queryGetPrinterList, queryGetPrinterInfo, queryChangePrinterState, queryRemovePrinter, queryCreatePrinter, queryUpdatePrinterInfo, getDefaultConfigQuery,
      updatePageNumberQuery, updateDateQuery, updateSideQuery, updatePaperTypeQuery, updateFileTypeQuery, updateVerticalQuery } = require('../model/spso.model');

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

function getPrinterInfo(req, res)
{
      const id = req.query.id;
      queryGetPrinterInfo(id, (result, err) =>
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

function changePrinterState(req, res)
{
      const id = req.query.id;
      const newState = req.body.params.newState;

      queryChangePrinterState(id, newState, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send({ message: "Printer state changed!" });
            }
      });
}

function removePrinter(req, res)
{
      const id = req.query.id;

      queryRemovePrinter(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send({ message: "Printer removed from system!" });
            }
      });
}

function createPrinter(req, res)
{
      const name = req.body.params.name;
      const model = req.body.params.model;
      const location = req.body.params.location;
      const description = req.body.params.description;

      queryCreatePrinter(name, model, location, description, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send({ message: "Printer added to system!" });
            }
      });
}

function updatePrinterInfo(req, res)
{
      const id = req.query.id;

      const name = req.body.params.name;
      const model = req.body.params.model;
      const location = req.body.params.location;
      const description = req.body.params.description;

      queryUpdatePrinterInfo(id, name, model, location, description, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  res.status(200).send({ message: "Printer info changed!" });
            }
      });
}

function getDefaultConfig(req, res)
{
      getDefaultConfigQuery((result, err) =>
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

function updatePageNumber(req, res)
{
      updatePageNumberQuery(req.body.params.number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
                  res.status(200).send({ message: "Update success!" });
      });
}

function updateDate(req, res)
{
      updateDateQuery(req.body.params.date, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
                  res.status(200).send({ message: "Update success!" });
      });
}

function updateSide(req, res)
{
      updateSideQuery(req.body.params.side, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
                  res.status(200).send({ message: "Update success!" });
      });
}

function updateVertical(req, res)
{
      updateVerticalQuery(req.body.params.vertical, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
                  res.status(200).send({ message: "Update success!" });
      });
}

function updatePaperType(req, res)
{
      updatePaperTypeQuery(req.body.params.paper, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
                  res.status(200).send({ message: "Update success!" });
      });
}

function updateFileType(req, res)
{
      const types = req.body.params.types;
      updateFileTypeQuery(types.split(','), (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
                  res.status(200).send({ message: "Update success!" });
      });
}

module.exports = {
      getPrinterList, getPrinterInfo, changePrinterState, removePrinter, createPrinter, updatePrinterInfo, getDefaultConfig,
      updatePageNumber, updateDate, updateSide, updatePaperType, updateFileType, updateVertical}