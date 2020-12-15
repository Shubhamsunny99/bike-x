
const express = require('express');
const {Centres, validate} = require('../models/centres')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
        let centre = new Centres({ 
        code:req.body.code,
        phone:req.body.phone,
        address: req.body.address,
      });
      centre = await centre.save();
      res.send({"err": 0, "centre": centre});
  });
  router.get('/', async (req, res) => {
    const centre = await Centres.find();
    res.send(centre);
  });
  
  router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

    const centre = await Centres.findByIdAndUpdate(req.params.id,
      { 
        code:req.body.code,
        phone:req.body.phone,
        address: req.body.address,
      }, { new: true });
  
    if (!centre) return res.status(404).send('The centre with the given ID was not found.');
    
    res.send(centre);
  });

  router.delete('/:id', async (req, res) => {
    const centre = await Centres.findByIdAndRemove(req.params.id);
  
    if (!centre) return res.status(404).send('The centre with the given ID was not found.');
  
    res.send(centre);
  });

module.exports = router;
