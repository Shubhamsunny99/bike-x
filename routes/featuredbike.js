
const express = require('express');
const {Featured, validate} = require('../models/featuredbikes')
const router = express.Router();

router.post('/', async (req, res) => {
    const feature = await Featured.find({"vehicle_id":req.body.vehicle_id})
        if(feature.length > 0){
            res.status(400).send("vehicle already is featured")
        }else{
            const { error } = validate(req.body); 
            if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
                let featured = new Featured({ 
                vehicle_id:req.body.vehicle_id,
                model_id: req.body.model_id,
              });
              featured = await featured.save();
              res.send({"err": 0, "featured": featured});
        }
  });

  router.post('/getVehicle', async (req, res) => {
    const featured = await Featured.find().limit(req.body.limit).sort( { date: -1 }).populate({
        path:'model_id',
        select:'-wheel_type -transmission_type -__v -number_of_gears -mileage -abs -fuel_system -power -vehicle_type -fuel_type -engine_cc -tyre_type -tank_capacity -front_brake_type -rear_brake_type -cooling_system -starting -drive_type -console -kerb_weight -date -updated -comments -_id'
    }).select('-__v -_id');
    res.send(featured);
  });

  router.get('/', async (req, res) => {
    const featured = await Featured.find().limit(10).sort( { date: -1 }).populate({
        path:'model_id',
        select:'-wheel_type -transmission_type -__v -number_of_gears -mileage -abs -fuel_system -power -vehicle_type -fuel_type -engine_cc -tyre_type -tank_capacity -front_brake_type -rear_brake_type -cooling_system -starting -drive_type -console -kerb_weight -date -updated -comments -_id'
    }).select('-__v');
    res.send(featured);
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
    const faq = await Featured.findByIdAndRemove(req.params.id);
  
    if (!faq) return res.status(404).send('The faq with the given ID was not found.');
  
    res.send(faq);
  });

module.exports = router;
