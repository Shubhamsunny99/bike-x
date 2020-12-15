
const express = require('express');
const {Documents, validate} = require('../models/documents')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
        let doc = new Documents({ 
        vehicle_id:req.body.vehicle_id,
        noc_date: Date.now(),
      });
      doc = await doc.save();
      res.send({"err": 0, "doc": doc});
  });

  router.put('/apply_drc/:id', async (req, res) => {

    const documents = await Documents.findOneAndUpdate({'vehicle_id': req.params.id},
      { 
        drc_agent:req.body.drc_agent,
        drc_applied_date: Date.now(),
        drc_amount:req.body.drc_amount,
        drc_paysource: req.body.drc_paysource,
      }, { new: false });
  
    if (!documents) return res.status(404).send('The documents with the given ID was not found.');
    
    res.send(documents);
  });

  router.put('/apply_too/:id', async (req, res) => {

    const documents = await Documents.findOneAndUpdate({'vehicle_id': req.params.id},
      { 
        too_agent:req.body.too_agent,
        too_applied_date: Date.now(),
        too_amount:req.body.too_amount,
        too_paysource: req.body.too_paysource,
      }, { new: false });
  
    if (!documents) return res.status(404).send('The documents with the given ID was not found.');
    
    res.send(documents);
  });

  router.put('/drc_received/:id', async (req, res) => {
    const documents = await Documents.findOneAndUpdate({'vehicle_id': req.params.id},
      { 
        drc_received_date:Date.now(),
      }, { new: false });  
    if (!documents) return res.status(404).send('The documents with the given ID was not found.');   
    res.send(documents);
  });

  router.put('/too_received/:id', async (req, res) => {
    const documents = await Documents.findOneAndUpdate({'vehicle_id': req.params.id},
      { 
        too_received_date:Date.now(),
      }, { new: false });  
    if (!documents) return res.status(404).send('The documents with the given ID was not found.');   
    res.send(documents);
  });

  router.put('/handed/:id', async (req, res) => {
    const documents = await Documents.findOneAndUpdate({'vehicle_id': req.params.id},
      { 
        handed_date:Date.now(),
        customer:req.body.customer
      }, { new: false });  
    if (!documents) return res.status(404).send('The documents with the given ID was not found.');   
    res.send(documents);
  });

  router.get('/:id', async (req, res) => {
    const documents = await Documents.find({"vehicle_id": req.params.id}).limit(1);
    res.send(documents);
  });
  

  router.delete('/:id', async (req, res) => {
    const documents = await Documents.findByIdAndRemove(req.params.id);
  
    if (!documents) return res.status(404).send('The Documents with the given ID was not found.');
  
    res.send(documents);
  });

module.exports = router;
