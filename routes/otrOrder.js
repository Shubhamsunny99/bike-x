const express = require('express');
const router = express.Router();
const {Otr_Purchase, validate} = require('../models/otr_purchase')


router.post('/generateOrder' , async (req , res) => {
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send({"err": 1 , "msg" : `${error.details[0].message.split(/["\" \\]/)[1]} not to be empty.`});

        let otr_purchase = new Otr_Purchase({
            firstname      : req.body.firstname, 
            lastname       : req.body.lastname,
            email          : req.body.email,
            phone          : req.body.phone,
            payment_status : req.body.payment_status,
            booking_status : req.body.booking_status,
            model_id       : req.body.model_id,
            superset_data  : req.body.superset_data,
            amount         : req.body.amount,
            del_address    : req.body.del_address,
            del_city       : req.body.del_city,
            del_state      : req.body.del_state,
            del_postalCode : req.body.del_postalCode,
            rto_address     : req.body.rto_address,
            rto_city        : req.body.rto_city,
            rto_state       : req.body.rto_state,
            rto_postalCode  : req.body.rto_postalCode,
            add_ons          : req.body.add_ons,
            vehicle_details  : req.body.vehicle_details
        })

        await otr_purchase.save().then((data) => {
            let obj = JSON.parse(JSON.stringify(data))
            return res.send(obj)

        }).catch((err) => {
            console.log(err)
            return res.send({"err": 1 , "msg" : "Order not added"}); 
        })

    }catch(e){
        console.log(e)
      return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.put('/confirmOrder/:id' , async (req , res) => {
try{
    let id = req.params.id
    if(!id){
        return res.send({"err": 1 , "msg" : "Not a valid id"}); 
    }
    let obj = { 
        razorpay_payment_id : req.body.razorpay_payment_id,
        razorpay_order_id   : req.body.razorpay_order_id,
        payment_status      : req.body.payment_status,
        booking_status      : req.body.booking_status,
        comment             : req.body.comment,
        updatedAt           : Date.now()
    }

    await  Otr_Purchase.updateOne({_id : id} , {$set : obj})
        .then((data) => {
            return res.status(200).send({"err": 0 , "msg" : "Payment data updated successfully"}); 

        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Payment data not updated"}); 
        })

}catch(e){
    return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
}
})

router.get('/fetch-individual-order/:id' , async (req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"});
        }

        await Otr_Purchase.findOne({_id : id})
        .populate({
            path : 'model_id'
        })
        .then((data) => {
            if(!data){
                return res.send({"err": 1 , "msg" : "Order not found"}); 
            }else{
                return res.send(data)
            }

        }).catch((err) => {
            console.log(err)
            return res.send({"err": 1 , "msg" : "Order fetch error"}); 
        })

    }catch(e){
        console.log(e)
      return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.get('/fetch-order-list' , async (req , res) => {
    try{
        let limit  = parseInt(req.query.limit)
        let skip = (parseInt(req.query.page)-1)*parseInt(limit)
        await Otr_Purchase.find().sort({createdAt : -1}).limit(limit).skip(skip)
        .populate({
            path : 'model_id'
        })
        .then((data) => {
            return res.send(data)

        }).catch((err) => {
            console.log(err)
            return res.send({"err": 1 , "msg" : "Order fetch error"}); 
        })

    }catch(e){
        console.log(e)
      return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.post('/fetch-order-by-phone' , async (req , res) => {
    try{
        await Otr_Purchase.find({phone : req.body.phone}).sort({createdAt : -1})
            .then((data) => {
                return res.send(data)

            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Error in fetch order"}); 
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.put('/update-rating-and-feedback/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }

        await Otr_Purchase.updateOne({_id : id} , {$set : {rating: req.body.rating , feedback: req.body.feedback}})
            .then((data) => {
                return res.status(200).send({"err": 0 , "msg" : "Successfully updated"});

            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Not updated"}); 
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

module.exports = router