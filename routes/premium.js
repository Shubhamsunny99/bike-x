const {Vehicles} = require('../models/vehicles')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const premiumVehicles = await Vehicles.find({premium:true});
  res.send(premiumVehicles);
});
module.exports = router;