const express = require('express');
const {Customer, validate} = require('../models/customers')
const router = express.Router();
var multer  = require('multer')
var passwordHash = require('password-hash');

const SendOtp = require('sendotp');
const sendOtp = new SendOtp('310801AwwK4rO25e0af36eP1', 'OTP for your order is {{otp}}, please do not share it with anybody.');

var msg91 = require("msg91")("310801AwwK4rO25e0af36eP1","MBIKEX","4");

 
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

    const customer = await Customer.findOne({"phone":req.body.phone});
    if(!customer){


    let customer = new Customer({ 
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email,
      password: passwordHash.generate(req.body.password),
    });
    customer = await customer.save();
    var phone = req.body.phone
    var username = req.body.firstname
    // var supportphone  = ["7602743422","6363623189","9986678450","9742744444"]

    // msg91.send(supportphone,`${username} have just registered with us. You can reach customer at ${phone}. Team BikeX.`, function(err, response){
    // });

      msg91.send(phone,`Hi ${username}, Your BikeX account has been created successfully. You're all set! Go and explore our BikeX catalog at bikex.in. You are going to love it!`, function(err, response){
        res.send({response, err, phone});
      }); 
    }else{
      res.status(409).send({"err":1, "msg":"Customer already exists."})
    }
  }); 
  router.get('/', async (req, res) => {
    const customers = await Customer.find().sort( { date: -1 })
    .select("-password");
    res.send(customers);
  }); 


  router.post('/test/message', async (req, res) => {
  var phone = req.body.phone
  var username = req.body.firstname
    msg91.send(phone,`Hi ${username}, Your BikeX account has been created successfully. You're all set! Go and explore our BikeX catalog at bikex.in. You are going to love it!`, function(err, response){
      res.send({response, err, phone});
    });

//   msg91.getBalance("4", function(err, msgCount){
//     console.log(err);
//     console.log(msgCount);
// });

  });

  router.get('/:id', async (req, res) => {
    const customers = await Customer.findById(req.params.id)
    .select("-password");
    res.send(customers);
  });
 
  router.get('/fetch/total-customer-length', async (req, res) => {
    const customer = await Customer.find();
    var length = customer.length
    res.send({"total":length});
});
 
  router.post('/validate', async (req, res) => {

    const customers = await Customer.find({"email":req.body.email});
    if(customers){
      for( var i in customers){
        if(passwordHash.verify(req.body.password,customers[i].password)){
          res.send({err:0,msg:'Sucessfull', data:customers});
        }else{
          res.send({err:1,msg:'Invalid Password'});
        }
      }
    }
      res.send({err:1,msg:'Email is not registered with us..'});
  });

router.post('/emailverify', async (req, res) => {

  const customers = await Customer.find({"email":req.body.email});
  if(customers.length != 0){
    res.send({err:1,msg:'Email already exists.'});
  }
    res.send({err:0,msg:'Available'});
});

router.post('/sendotp', async (req, res) => {
  sendOtp.send(req.body.phone, "MBIKEX", function (error, data) {
    res.send(data);
  });
});

router.post('/otp-retry', async (req, res) => {
  sendOtp.send(req.body.phone, "MBIKEX", function (error, data) {
    res.send(data);
  });
});

router.post('/verifyotp', async (req, res) => {
  sendOtp.verify(req.body.phone, req.body.otp, function (error, data) {
    console.log(data); // data object with keys 'message' and 'type'
    if(data.type == 'success') res.send('OTP verified successfully')
    if(data.type == 'error') res.send('OTP verification failed')
  });
});

router.post('/get/customerByNumber', async (req, res) => {
  const customer = await Customer.findOne({"phone":req.body.phone});
  if(!customer){
    res.status(404).send({"err":1,"msg":"Customer not found."});
  }else{
    res.send({"err":0, "customer":customer});
  }
});
  // update customes data(flag , comment , follow_up_date) by _id
router.put('/:id' , async (req , res) => {
  let obj = {
    flag           : req.body.flag,
    comment        : req.body.comment,
    follow_up_date : req.body.follow_up_date
  }

  if(obj.flag === "" || obj.flag == undefined){
    return res.send({"err" : "1" , "msg" : "flag is required"})
  }

  let update_customer = await Customer.findByIdAndUpdate({_id : req.params.id} , obj , {new : false})
  if(!update_customer){
    return res.send({"err" : "1" , "msg" : "Given ID not found"})
  }else{
    return res.send(update_customer)
  }
})
 // filter customes by follow_up_date
router.post('/filterby/date' , async (req, res) => {
  let customers = await Customer.find({follow_up_date : req.body.date})
  return res.send(customers)
})




  
module.exports = router;
