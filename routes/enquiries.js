const express = require('express');
const {Enquiry, validate} = require('../models/enquiry')
const {Sell} = require('../models/sells')
const router = express.Router();
var multer  = require('multer')
const _ = require('lodash')


const SendOtp = require('sendotp');
const sendOtp = new SendOtp('310801AwwK4rO25e0af36eP1', 'OTP for your order is {{otp}}, please do not share it with anybody.');

var msg91 = require("msg91")("310801AwwK4rO25e0af36eP1","MBIKEX","4");

 
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
    let enquiry = new Enquiry({ 
      name: req.body.name,
      bike_name: req.body.bike_name,
      mobile: req.body.mobile,
      email: req.body.email,
      source: req.body.source
    });
    enquiry = await enquiry.save();
    var mobile = req.body.mobile
    var username = req.body.name
    bike = req.body.bike_name
    // var supportphone  = ["7602743422","6363623189","9986678450","9742744444"]

    // msg91.send(supportphone,`${username} have just enquired for ${bike}. You can reach customer at ${mobile}. Team BikeX.`, function(err, response){
    // });

      msg91.send(mobile,`Hi ${username}, your request for ${bike} has been taken into account. Our executive will reach out to you shortly. We'll love to serve you. Team BikeX.`, function(err, response){
        res.send({response, err, mobile});
      }); 
  }); 

  router.get('/', async (req, res) => {
    const enquiry = await Enquiry.find().sort({ date: -1 })
    res.send(enquiry);
  });  

  router.get('/fetch/leadcount', async (req, res) => {
    Enquiry.find().sort( { date: -1 }).then(x=>{
      var uniq = _.uniqBy(x, 'source');
      response=[]
      for (var i in uniq){
        var item ={}    
        var entries = x.filter(y=>{
            return y.source == uniq[i].source
        })
        item.source = uniq[i].source
        item.count = entries.length
        response.push(item)
      }
      res.send(response);
    })   
  });

  router.put('/:id', async (req, res) => {

    if(req.body.status == 1){
      const enquiry = await Enquiry.findOneAndUpdate({"_id":req.params.id},
      {
        status:req.body.status,
        comment: req.body.comment,
        next_action_date:req.body.next_action_date,
        walkin_status:req.body.walkin_status,
        walkin_comment:req.body.walkin_comment
      },{ new: false });

      if(!enquiry){
        res.send({"msg":"Given ID not found!"})
      }else{
        res.send(enquiry);
      }
    }else if(req.body.status == 2){
      const enquiry = await Enquiry.findOneAndUpdate({"_id":req.params.id},
      {
        status:req.body.status,
        comment: req.body.comment,
        sold_status:req.body.sold_status,
      },{ new: false });

      if(!enquiry){
        res.send({"msg":"Given ID not found!"})
      }else{
        res.send(enquiry);
      }
    }else{
      const enquiry = await Enquiry.findOneAndUpdate({"_id":req.params.id},
      {
        status:req.body.status,
        comment: req.body.comment,
      },{ new: false });

      if(!enquiry){
        res.send({"msg":"Given ID not found!"})
      }else{
        res.send(enquiry);
      }
    }

    
  }); 


  router.post('/test/message', async (req, res) => {
  var phone = req.body.phone
  var username = req.body.firstname
    msg91.send(phone,`Hi ${username}, Your BikeX account has been created successfully. You're all set! Go and explore our BikeX catalog at bikex.in. You are going to love it!`, function(err, response){
      res.send({response, err, phone});
    });
  });

  router.post('/fetch/entrybydate', async (req, res) => {
    const enquiry = await Enquiry.find({"next_action_date":req.body.next_action_date});
    res.send(enquiry);
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

router.get('/seller-buyer-info' , async (req , res) => {
    await Sell.aggregate([
      {
        $lookup: {
            from         : "enquiries",
            localField   : "model",
            foreignField : "bike_name",
            as           : "seller_buyer"
        }
    },
    {
      $project: {
        _id : 0,
        make : "$make",
        model : "$model",
        name  : "$name" , 
        mobile : "$mobile",
        city : "$city",
        state : "$state",
        buyer : "$seller_buyer"
      }
    }
    ]).then(async(data) => {
          let new_obj = {}
          await data.map((el) => {
            if(el.buyer.length > 0){
              console.log(el)
              if(el.model in new_obj){
                new_obj[el.model]["seller"].push({
                  "name" : el.name,
                  "mobile" : el.mobile,
                  "city" : el.city,
                  "state" : el.state
                })
                // console.log(el)
                new_obj[el.model]["buyer"].concat(el.buyer)
              }else{
                new_obj[el.model] = {}
                new_obj[el.model]["make"] = el.make
                new_obj[el.model]["model"] = el.model
                new_obj[el.model]["seller"] = [
                  {
                    "name" : el.name,
                    "mobile" : el.mobile,
                    "city" : el.city,
                    "state" : el.state
                  }
                ]
                new_obj[el.model]["buyer"] = el.buyer

              }
            }
          })
          console.log("Shubham")
          return res.send(Object.values(new_obj))

    }).catch((err) => {
      console.log(err)
      return res.send({"err": 1 , "msg" : "Error in fetch seller and buyer data"});
    })
})
  
module.exports = router;
