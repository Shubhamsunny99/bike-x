
const {Procured, validate} = require('../models/procurements')
const express = require('express');
const router = express.Router();
var multer  = require('multer')
const app = express();
const _ = require('lodash')

router.get('/procured-vehicle', async (req, res) => {
    const procured = await Procured.find({"status":0}).populate({
        path:'model_id',
        select:''
    });
    res.send(procured);
});

router.get('/procured-vehicle/:id', async (req, res) => {
    const procured = await Procured.find({"vehicle_id":req.params.id}).populate({
        path:'model_id',
        select:''
    });
    res.send(procured);
});



router.get('/all-vehicles', async (req, res) => {
    const procured = await Procured.find().populate({
        path:'model_id',
        select:''
    });
    res.send(procured);
});


router.get('/under-refurbish', async (req, res) => {
    const procured = await Procured.find({"status":1});
    res.send(procured);
});

router.get('/instock-vehicle', async (req, res) => {
    const procured = await Procured.find({"status":2});
    res.send(procured);
});
router.get('/live-vehicle', async (req, res) => {
    const procured = await Procured.find({"status":{ $in: [3, 4]}
    }).populate({
        path:'model_id',
        select:'-date -updated'
    })
    .select('-insurance_policy_number -rc_card -documents -imageUpload -vehicle_number -fines -source -city -pincode -state -address -insurance -b_extract -hypothecation -regn_no -chassis_no -rc_start -rc_end -insurance_start -insurance_end -remark -procured_date -procured_price -refurbishment_received -live_date -date -updated -_id')
    res.send(procured);
});
router.get('/live-vehicle/scooters', async (req, res) => {
    const procured = await Procured.find({"status":{ $in: [3, 4]}
    }).populate({
        path:'model_id',
        select:'-date -updated'
    })
    .select(' -insurance_policy_number -rc_card -documents -imageUpload -vehicle_number -fines -source -city -pincode -state -address -insurance -b_extract -hypothecation -regn_no -chassis_no -rc_start -rc_end -insurance_start -insurance_end -remark -procured_date -procured_price -refurbishment_received -live_date -date -updated -_id')
    const x = procured.filter((data)=>{
        return data.model_id.vehicle_type === 'commuters'
    })
    res.send(x);
});
router.get('/live-vehicle/commuters', async (req, res) => {
    const procured = await Procured.find({"status":{ $in: [3, 4]}
    }).populate({
        path:'model_id',
        select:'-date -updated'
    })
    .select(' -insurance_policy_number -rc_card -documents -imageUpload -vehicle_number  -fines -source -city -pincode -state -address -insurance -b_extract -hypothecation -regn_no -chassis_no -rc_start -rc_end -insurance_start -insurance_end -remark -procured_date -procured_price -refurbishment_received -live_date -date -updated -_id')
    const x = procured.filter((data)=>{
        return data.model_id.vehicle_type === 'bikes'
    })
    res.send(x);
});
router.get('/live-vehicle/adventurer', async (req, res) => {
    const procured = await Procured.find({"status":{ $in: [3, 4]}
    }).populate({
        path:'model_id',
        select:'-date -updated'
    })
    .select(' -insurance_policy_number -rc_card -documents -imageUpload -vehicle_number  -fines -source -city -pincode -state -address -insurance -b_extract -hypothecation -regn_no -chassis_no -rc_start -rc_end -insurance_start -insurance_end -remark -procured_date -procured_price -refurbishment_received -live_date -date -updated -_id')
    const x = procured.filter((data)=>{
        return data.model_id.vehicle_type === 'adventurer'
    })
    res.send(x);
    // if(x){
    //     res.send(x);
    // }else{
    //     res.send([])
    // }
});

router.get('/booked-vehicle', async (req, res) => {
    const procured = await Procured.find({"status":4});
    res.send(procured);
});
router.get('/sold-vehicle', async (req, res) => {
    const procured = await Procured.find({"status":5});
    res.send(procured);
});
router.get('/all-purchase', async (req, res) => {
    const procured = await Procured.find({"status":{ $in: [4, 5]}});
    res.send(procured);
});
router.get('/sold-vehicle-length', async (req, res) => {
    const procured = await Procured.find({"status":5});
    var length = procured.length
    res.send({"total":length});
});
router.get('/booked-vehicle-length', async (req, res) => {
    const procured = await Procured.find({"status":4});
    var length = procured.length
    res.send({"total":length});
});

router.get('/total-vehicle-length', async (req, res) => {
    const procured = await Procured.find();
    var length = procured.length
    res.send({"total":length});
});

router.get('/similar-vehicle', async (req, res) => {
    const procured = await Procured.find({"vehicle_id": { $ne: req.query.v_id}}).limit(50);
    res.send(procured);
});

router.get('/top-selling-vehicle', async (req, res) => {
    const procured = await Procured.find()
    .populate({
        path:'model_id',
        select:'-date -updated'
    }).limit(6);
    res.send(procured);
});

router.post('/budget-bikes', async (req, res) => {
    const procured = await Procured.find({selling_price:{$gt:req.body.min,$lt:req.body.max}}).limit(6);
    res.send(procured);
});


router.get('/margin', async (req, res) => {
    const procured = await Procured.find({"status":5});
    
    margin = procured[0].selling_price++
    
    res.send({'data':margin});
});

router.post('/squadVoice/allResponse', async(req, res)=>{
    const data = req.body
    res.send(data)
})
module.exports = router;
