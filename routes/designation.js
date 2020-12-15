
const express = require('express');
const {Designation, validate} = require('../models/desigation')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
        let designation = new Designation({ 
        designation_name:req.body.designation_name,
      });
      designation = await designation.save();
      res.send({"err": 0, "designation": designation});
  });

  router.get('/', async (req, res) => {
    const desigation = await Designation.find().sort( { date: -1 });
    res.send(desigation);
  });
  
  router.put('/edit_vehicle/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
    console.log(req.body.question)
    const designation = await Designation.findByIdAndUpdate(req.params.id,
      { 
        edit_vehicle:req.body.edit_vehicle,
      }, { new: true });
  
    if (!designation) return res.status(404).send('The designation with the given ID was not found.');
    
    res.send(designation);
  });

  router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
    console.log(req.body.question)
    const faq = await Faq.findByIdAndUpdate(req.params.id,
      { 
        question:req.body.question,
        answer: req.body.answer,
      }, { new: true });
  
    if (!faq) return res.status(404).send('The faq with the given ID was not found.');
    
    res.send(faq);
  });

  router.delete('/:id', async (req, res) => {
    const faq = await Faq.findByIdAndRemove(req.params.id);
  
    if (!faq) return res.status(404).send('The faq with the given ID was not found.');
  
    res.send(faq);
  });

module.exports = router;
