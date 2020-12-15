
const express = require('express');
const {Message, validate} = require('../models/sendmessage')
const {Customer} = require('../models/customers')

const router = express.Router();
var msg91 = require("msg91")("310801AwwK4rO25e0af36eP1","MBIKEX","4");

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
    var phone = req.body.phone
    message = req.body.message
    msg91.send(phone,`${message}`, async function(err, response){
        if(response){
            let message = new Message({ 
                message:req.body.message,
                customer_id: req.body.customer_id,
                agent_id: req.body.agent_id,
                phone: req.body.phone,
                agent_username: req.body.agent_username,
          });
          message = await message.save();
          res.send({"err": 0, "message": message, "response": response});
        }else if(err){
            res.send({"err": 1, "message": err});
        }
    });    
  }); 

  router.post('/array', async (req, res) => {
    var x = req.body.ids
    var phone = []
    for (var i in x){
      const customer = await Customer.find({"_id": x[i]});
      if(customer){
        phone.push((customer[0].phone).toString())
      }else{
        phone.push("")
      }
    }
    
      message = req.body.message
      msg91.send(phone,`${message}`, async function(err, response){
             for (var i in x){
              let message = new Message({ 
                message:req.body.message,
                customer_id: x[i],
                agent_id: req.body.agent_id,
                phone: phone[i],
                agent_username: req.body.agent_username,
              });
              message = await message.save()
             }
      });    
    
    res.send('sucess')
  });


  router.get('/', async (req, res) => {
    const message = await Message.find().sort( { date: -1 });
    res.send(message);
  });
  router.get('/:id', async (req, res) => {
    const message = await Message.find({"customer_id":req.params.id}).sort( { date: -1 });
    res.send(message);
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
