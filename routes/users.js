var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = function (db) {
  const collection = db.collection('users');

  router.get('/', async function (req, res, next) {
    try {
      // searching
      const {name, address} = req.query
      const params = {}
      if(name){
        params['name'] = new RegExp(name, 'i')
      }

      if(address){
        params['address'] = new RegExp(address, 'i')
      }

      const page = req.query.page || 1
      const limit = 3
      const offset = (page - 1) * limit
      const total = await collection.countDocuments(params)
      const pages = Math.ceil(total / limit)
      const findResult = await collection.find(params).limit(limit).skip(offset).toArray();
      res.status(200).json({
        data: findResult,
        page: parseInt(page),
        pages: pages,
        offset
      })
    } catch (e) {
      console.log(e)
      res.json(e)
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const insertResult = await collection.insertOne({ name: req.body.name, address: req.body.address });
      res.status(201).json(insertResult)
    } catch (e) {
      res.json(e)
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      const updateResult = await collection.updateOne({ _id: ObjectId(req.params.id) }, { $set: { name: req.body.name, address: req.body.address } });
      res.status(201).json(updateResult)
    } catch (e) {
      res.json(e)
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const deleteResult = await collection.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(201).json(deleteResult)
    } catch (e) {
      res.json(e)
    }
  });

  return router;
}
