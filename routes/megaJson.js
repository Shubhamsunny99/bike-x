const {Procured} = require('../models/procurements')
const {Modals} = require('../models/modals')
const {VehicleUploads} = require('../models/bikeupload')
const {VehicledisplayUploads} = require('../models/bikedisplayupload')
const express = require('express');
const router = express.Router();
const app = express();
var _ = require('lodash');


router.get('/', async (req, res) => {
    let [procured, modals] = await Promise.all([Procured.find(), Modals.find()]);
    
    const merge = (arr1, arr2) => {
      const temp = []
    
      arr1.forEach(x => {
        arr2.forEach(y => {
          if (x.model_id === y) {
            temp.push({ ...x, ...y })
          }
        })
      })
    
      return temp
    }

 console.log(merge(procured, modals))
  
    res.send(modals);
  });

module.exports = router;
