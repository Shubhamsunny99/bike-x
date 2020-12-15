
const express = require('express');
const {Premium, validate} = require('../models/premium')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

   Premium.findOne({cc:req.body.cc}).then(async result=>{
     if(!result){
        let premium = new Premium({ 
          cc: req.body.cc,
          price: req.body.price,
          description:req.body.description,
          offer_price: req.body.offer_price,
      });
      premium = await premium.save();
      res.send({"err": 0, "premium": premium});
      }
      else{
        res.send({msg:'CC you provided already exists, please edit it in editor!'})
      }
   })
  });
  router.get('/', async (req, res) => {
    const premium = await Premium.find();
    res.send(premium);
  });
module.exports = router;
