const {Modals, validate} = require('../models/modals')
const express = require('express');
const router = express.Router();
var multer  = require('multer')
const app = express();
var _ = require('lodash');

let DIR='./attach/modals';
//for file upload with multer
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,DIR)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
  })
  
let upload = multer({ storage: storage }).single('Image');

router.post('/', async (req, res) => {
    upload(req,res, async function(err)
    {
     if(err)
       {}
        else
          {
          const { error } = validate(req.body); 
          if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
          
          const modals = await Modals.find();
          const id = _.findLast(modals, function(n) {
            return n._id;
          });
          if(!id){ids = 100}

          else{ids = id._id}
          let modal = new Modals({
            _id: Number(ids)+1,
            modal_name:req.body.modal_name,
            make:req.body.make,
            engine_cc: req.body.engine_cc,
            fuel_type:req.body.fuel_type,
            vehicle_type:req.body.vehicle_type,
            power: req.body.power,
            fuel_system: req.body.fuel_system,
            abs: req.body.abs,
            mileage:req.body.mileage,
            number_of_gears:req.body.number_of_gears,
            transmission_type:req.body.transmission_type,
            wheel_type:req.body.wheel_type,
            tyre_type: req.body.tyre_type,
            tank_capacity:req.body.tank_capacity,
            front_brake_type:req.body.front_brake_type,
            rear_brake_type:req.body.rear_brake_type,
            cooling_system:req.body.cooling_system,
            starting:req.body.starting,
            drive_type:req.body.drive_type,
            console:req.body.console,
            kerb_weight: req.body.kerb_weight,  
            comments:req.body.comments,
            });           
        modal =  await modal.save();
        if(err){
          res.json({'err':1,'msg':'Modal_error'})
        }
          else
          {
          res.json(modal)
          } 
      }
    });
});

router.get('/', async (req, res) => {
    const modal = await Modals.find().sort( { date: -1 });
    res.send(modal);
});

router.get('/:id', async (req, res) => {
  const modal = await Modals.find({'_id': req.params.id});
  res.send(modal);
});

router.get('/type/:id', async (req, res) => {
  const modal = await Modals.find({'vehicle_type': req.params.id});
  res.send(modal);
});


router.put('/:id', async (req, res) => {
  console.log(req.body.updated)
  const { error } = validate(req.body); 
  if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  const modal = await Modals.findByIdAndUpdate(req.params.id,
    { 
      modal_name:req.body.modal_name,
      make:req.body.make,
      engine_cc: req.body.engine_cc,
      fuel_type:req.body.fuel_type,
      vehicle_type:req.body.vehicle_type,
      power: req.body.power,
      fuel_system: req.body.fuel_system,
      abs: req.body.abs,
      mileage:req.body.mileage,
      number_of_gears:req.body.number_of_gears,
      transmission_type:req.body.transmission_type,
      wheel_type:req.body.wheel_type,
      tyre_type: req.body.tyre_type,
      tank_capacity:req.body.tank_capacity,
      front_brake_type:req.body.front_brake_type,
      rear_brake_type:req.body.rear_brake_type,
      cooling_system:req.body.cooling_system,
      starting:req.body.starting,
      drive_type:req.body.drive_type,
      console:req.body.console,
      kerb_weight: req.body.kerb_weight,  
      comments:req.body.comments,
      updated: req.body.updated
    }, { new: false });

  if (!modal) return res.status(404).send('The modal with the given ID was not found.');
  
  res.send(modal);
});
router.delete('/:id', async (req, res) => {
  const modal = await Modals.findByIdAndRemove(req.params.id);

  if (!modal) return res.status(404).send('The modal with the given ID was not found.');

  res.send(modal);
});

module.exports = router;