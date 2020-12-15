const express = require('express');
const router = express.Router();

const SendOtp = require('sendotp');
const sendOtp = new SendOtp('310801AwwK4rO25e0af36eP1', 'OTP for your Login is {{otp}}, please do not share it with anybody.');

var msg91 = require("msg91")("310801AwwK4rO25e0af36eP1","MBIKEX","4");

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

  module.exports = router