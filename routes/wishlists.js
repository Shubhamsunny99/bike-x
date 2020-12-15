
const express = require('express');
const {Wishlist, validate} = require('../models/wishlist')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
        let wishlist = new Wishlist({ 
        v_id:req.body.v_id,
        c_id: req.body.c_id,
      });
      wishlist = await wishlist.save();
      res.send({"err": 0, "wishlist": wishlist});
  });
  router.get('/', async (req, res) => {
    const wishlist = await Wishlist.find();
    res.send(wishlist);
  });
  router.get('/:id', async (req, res) => {
    const wishlist = await Wishlist.find({"c_id":req.params.id});
    if(wishlist){
        res.send(wishlist);
    }else{
        res.send('No records found!')
    }
  });
  
//   router.put('/:id', async (req, res) => {
//     const { error } = validate(req.body); 
//     if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
//     console.log(req.body.question)
//     const faq = await Faq.findByIdAndUpdate(req.params.id,
//       { 
//         question:req.body.question,
//         answer: req.body.answer,
//       }, { new: true });
  
//     if (!faq) return res.status(404).send('The faq with the given ID was not found.');
    
//     res.send(faq);
//   });

  router.delete('/:id', async (req, res) => {
    const wishlist = await Wishlist.findByIdAndRemove(req.params.id);
  
    if (!wishlist) return res.status(404).send('The wishlist with the given ID was not found.');
  
    res.send(wishlist);
  });

module.exports = router;
