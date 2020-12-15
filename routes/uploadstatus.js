const {Procured, validate} = require('../models/procurements')
const express = require('express');
const router = express.Router();
var multer  = require('multer')
const app = express();

router.put('/:id', async (req, res) => {

  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
    { 
        imageUpload: req.body.status
    }, { new: false });
  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  res.send(procured);
});

router.get('/pending-upload', async (req, res) => {

  const procured = await Procured.find({'imageUpload': 0})

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  
  res.send(procured);


});



module.exports = router;