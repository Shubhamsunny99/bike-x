
const express = require('express');
const app=express();
const {Vehicles, validate} = require('../models/vehicles')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  
    let vehicle = new Vehicles({
      model: req.body.model,
      registration_number: req.body.registration_number,
      color: req.body.color,
      chassis_number: req.body.chassis_number,
      engine_number: req.body.engine_number,
      year_of_purchase: req.body.year_of_purchase,
      rc_start_date: req.body.rc_start_date,
      rc_end_date: req.body.rc_end_date,
      insurance_policy_number: req.body.insurance_policy_number,
      insurance_end_date: req.body.insurance_end_date,
      manufacture_date: req.body.manufacture_date,
      price: req.body.price,
      waitlist: req.body.waitlist,
      displacement:req.body.displacement,
      premium: req.body.premium,
      file_name:req.file.filename
    });
    vehicle = await vehicle.save();
    res.send({"err": 0, "vehicle": vehicle});
  });

  router.get('/', async (req, res) => {
    const vehicles = await Vehicles.find();
    res.send({"err": 0, bikes : vehicles});
  });

router.get('/delete/:id',function(req,res)
{
    let bike_id=req.params.id;
    Vehicles.remove({'_id':bike_id},function(err)
{
    if(err){
      res.json({'err':1,'msg':'Unable to Delete'})
    }
    else
    {
        res.json({'err':0,'msg':'Bike Deleted'})
    }
})
})

router.get('/:models', async (req, res) => {
  const model = req.params.models;
  const vehicles = await Vehicles.find({'model':model});
  res.send({"err": 0, bikes : vehicles});
});

module.exports = router;