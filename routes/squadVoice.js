const express = require('express');
const {Response} = require('../models/squadvoiceresponse')

const router = express.Router();


// router.post('/', async (req, res) => {
//     console.log(req.body)
//     res.send({"msg":"We have recorded the response"}).status(200).end()
//   })

  router.post('/', async (req, res) => {
    let response = new Response({ 
      phone_number:req.body.phone_number,
      lead_id: req.body.lead_id,
      booking_date: req.body.booking_date,
      lead_email:req.body.lead_email,
      unique_payment_link: req.body.unique_payment_link,
      vehicle_interested: req.body.vehicle_interested,
      lead_responses: req.body.lead_responses,
      latest_recording_url:req.body.latest_recording_url,
      campaign_id:req.body.campaign_id,
      latest_called_at:req.body.latest_called_at,
      waitlist_vehicle:req.body.waitlist_vehicle,
      waitlist_date:req.body.waitlist_date,
      lead_outcome:req.body.lead_outcome,
      processed_at:req.body.processed_at,
      created_at:req.body.created_at,
    });
    response =  await response.save()
      .then((response_data)=>{
        res.send({'err':0,'msg':'We have received your response.', 'response_data':response_data}).status(200).end()
      }).catch((err)=>{
        console.log(err)
        res.send({'err':1,'cx_msg':`Internal Server Error`,'msg':err})
      })
  }); 

  router.get('/', async (req, res) => {
    const response = await Response.find().sort({ Received: -1 })
    res.send(response);
  });

  router.get('/count', async (req, res) => {
    var response= {}
    await Response.find({lead_outcome:'Interested'}).then(x=>{
      response.interested = x.length
    })
    await Response.find({lead_outcome:'Not Connected'}).then(y=>{
      response.Not_Connected = y.length
    })
    await Response.find({lead_outcome:'Not Interested'}).then(y=>{
      response.Not_Interested = y.length
    })
    res.send(response);
  });


module.exports = router;