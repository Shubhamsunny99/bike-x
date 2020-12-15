
const express = require('express');
const {Purchase, validate} = require('../models/purchase')
const {Procured} = require('../models/procurements')
const {Vehicles} = require('../models/vehicles')
const {Modals}   = require('../models/modals')
const {Customer} = require('../models/customers')

const {Sell} = require('../models/sells')
const router = express.Router();
var multer  = require('multer');

var msg91 = require("msg91")("310801AwwK4rO25e0af36eP1","MBIKEX","4");

 
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  console.log(req.body.vehicle_id)
  const purchase_history = await Procured.find({"vehicle_id":req.body.vehicle_id});
          for(var i in purchase_history){
            if(purchase_history[i].status == 3){
              let purchase = new Purchase({
                customer_id:req.body.customer_id,
                vehicle_id:req.body.vehicle_id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                email: req.body.email,
                amount:req.body.amount,
                tefflon: req.body.tefflon,
                extended_w: req.body.extended_w,
                rsa: req.body.rsa,
                delivery: req.body.delivery,
                comprehensive: req.body.comprehensive,
                address1:req.body.address1,
                address2:req.body.address2,
                town:req.body.town,
                mode_of_payment:req.body.mode_of_payment,
                image:req.body.image,
                model:req.body.model,
                state:req.body.state,
                postalcode: req.body.postalcode,
                payment_status:req.body.payment_status,
                source:req.body.source
            });
            purchase = await purchase.save();
            res.send(purchase);
       }else{
        res.send({err: 1, "msg":"The vehicle you are looking is unavailable."}); 
       }
      } 
  });


  router.post('/offline-sell', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
    console.log(req.body.vehicle_id)
    const vehicle = await Procured.find({"vehicle_id":req.body.vehicle_id});
            for(var i in vehicle){
              if(vehicle[i].status == 3 || vehicle[i].status == 2){
                let purchase = new Purchase({
                  customer_id:req.body.customer_id,
                  vehicle_id:req.body.vehicle_id,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  phone: req.body.phone,
                  email: req.body.email,
                  amount:req.body.amount,
                  tefflon: req.body.tefflon,
                  extended_w: req.body.extended_w,
                  rsa: req.body.rsa,
                  comprehensive: req.body.comprehensive,
                  address1:req.body.address1,
                  address2:req.body.address2,
                  town:req.body.town,
                  mode_of_payment:req.body.mode_of_payment,
                  image:req.body.image,
                  model:req.body.model,
                  state:req.body.state,
                  postalcode: req.body.postalcode,
                  payment_status:req.body.payment_status,
                  source:req.body.source
              });
              purchase = await purchase.save();
              res.send(purchase);
         }else{
          res.send({err: 1, "msg":"The vehicle you are looking is unavailable."}); 
         }
        } 
    });

    
  router.get('/', async (req, res) => {
    const purchase = await Purchase.find().sort( { date: -1 });
    res.send(purchase);
  });

  router.put('/:id', async (req, res) => {
      const purchase = await Purchase.findByIdAndUpdate(req.params.id,
        { 
            razorpay_order_id:req.body.razorpay_order_id,
            razorpay_payment_id:req.body.razorpay_payment_id,
            razorpay_signature:req.body.razorpay_signature,
            payment_status:req.body.payment_status
        }, { new: false });
      if (!purchase) return res.status(404).send('The purchase with the given ID was not found.');
      var phone = req.body.phone
      // var supportphone  = ["7602743422","6363623189","9986678450","9742744444"]
      var username = req.body.firstname
      var orderid = req.body.order_id
      var razor_id = req.body.razorpay_payment_id

        msg91.send(phone,`Hi ${username}, we have received your order. Your order ID is ${orderid} and payment ID is ${razor_id}. Our team will contact you shortly.`, function(err, response){
        }); 

        // msg91.send(supportphone,`New order received from ${username}, with order ID ${orderid} and payment ID ${razor_id}. Please reach customer at ${phone}`, function(err, response){
        //   res.send({response, err, supportphone, phone});
        // });
})
  router.get('/:id', async (req, res) => {
    const purchase = await Purchase.findById(req.params.id);
    res.send(purchase);
  });
  
  router.get('/customer/:id', async (req, res) => {
    const purchase_history = await Purchase.find({$and:[{"customer_id": req.params.id},{"payment_status": 1}]});
    res.send(purchase_history);
  });

  router.get('/get/notseen', async (req, res) => {
    const purchase = await Purchase.find({"seen":0});
    var length = purchase.length
    console.log(length)
    res.send({"total":length});
  });

  router.put('/changetoseen/:id', async (req, res) => {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id,
      {
        seen:1,
    }, { new: false });
    if (!purchase) return res.status(404).send('The purchase with the given ID was not found.');
    res.send(purchase);
  })


module.exports = router;
