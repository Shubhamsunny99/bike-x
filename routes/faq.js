
const express = require('express');
const {Faq, validate} = require('../models/faqs')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
        let faq = new Faq({ 
        question:req.body.question,
        answer: req.body.answer,
      });
      faq = await faq.save();
      res.send({"err": 0, "faq": faq});
  });
  router.get('/', async (req, res) => {
    const faq = await Faq.find().sort( { date: -1 });
    res.send(faq);
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
