
const express = require('express');
const {Standard, validate} = require('../models/standard')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  
    Standard.findOne({cc:req.body.cc}).then(async result=>{
      if(!result){
      let standard = new Standard({ 
          cc: req.body.cc,
          price: req.body.price,
          description:req.body.description,
          offer_price: req.body.offer_price,
      });
    standard = await standard.save();
    res.send({"err": 0, "standard": standard});
    }
  else{
    res.send({msg:'CC you provided already exists, please edit it in editor!'})
  }
  })
  });
  router.get('/', async (req, res) => {
    const standard = await Standard.find();
    res.send(standard);
  });
module.exports = router;
