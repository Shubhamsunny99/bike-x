const express = require('express');
const router = express.Router();

const {Procured}    = require('../models/procurements');
const {brokerTask}  = require('../models/brokerTasks');
const {Refurbished} = require('../models/refurbishment');

router.get('/bikex-live-vehicle' , async(req , res) => {
    try{
        await Procured.aggregate([
            {
                $lookup: {
                    from         : "vehicleuploads",
                    localField   : "vehicle_id",
                    foreignField : "vehicle_id",
                    as           : "bike_uploads"
                }
            },
            {
                $lookup: {
                    from         : "vehicle_display_uploads",
                    localField   : "vehicle_id",
                    foreignField : "vehicle_id",
                    as           : "bike_display_uploads"
                }
            }
        ]).then((data) => {
            return res.status(400).send({"err" : 0 , "vehicle" : data})

        }).catch((err) => {
            return res.status(400).send({"err": 1 , "msg" : "Vehicle details not fetched"});
        })
        
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

router.get('/vehicle-details-admin/:id' , async (req , res) => {
    try{
        await Procured.aggregate([
            {$match : {vehicle_id : Number(req.params.id)}},
            {
                $lookup: {
                    from         : "vehicleuploads",
                    localField   : "vehicle_id",
                    foreignField : "vehicle_id",
                    as           : "bike_uploads"
                }
            },
            {
                $lookup: {
                    from         : "vehicle_display_uploads",
                    localField   : "vehicle_id",
                    foreignField : "vehicle_id",
                    as           : "bike_display_uploads"
                }
            },
            {
                $lookup: {
                    from         : "broker_tasks",
                    localField   : "vehicle_id",
                    foreignField : "vehicle_number",
                    as           : "broker_data"
                }
            },
            {
                $lookup: {
                    from         : "refurbished_lists",
                    localField   : "vehicle_id",
                    foreignField : "vehicle_number",
                    as           : "refurbished_data"
                }
            }
        ]).then((final_data) => {
            // console.log(final_data)
            res.send(final_data)

        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in fetch vehicle details"});

        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})



module.exports = router