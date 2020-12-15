const {Procured, validate} = require('../models/procurements')
const express = require('express');
const router = express.Router();
var multer  = require('multer')
const app = express();

router.put('/:id', async (req, res) => {
if(req.body.status == 1){
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
    { 
        status:req.body.status,
        refurbishment_received:req.body.date
    }, { new: false });

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  
  res.send(procured);
}else if(req.body.status == 2){
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
    { 
        status:req.body.status,
        instock_date:req.body.date
    }, { new: false });

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  
  res.send(procured);
}else if(req.body.status == 3){
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
    { 
        status:req.body.status,
        live_date:req.body.date
    }, { new: false });

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  
  res.send(procured);
}
else if(req.body.status == 4){
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
    { 
        status:req.body.status,
        booked_date:req.body.date
    }, { new: false });

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  
  res.send(procured);
}
else if(req.body.status == 5){
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
    { 
        status:req.body.status,
        sold_date:req.body.date
    }, { new: false });

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  
  res.send(procured);
}
else if(req.body.status == 0){
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
    { 
        status:req.body.status,
    }, { new: false });

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  
  res.send(procured);
}
});



module.exports = router;