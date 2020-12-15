const express = require('express');
const {Purchase, validate} = require('../models/purchase')
const router = express.Router();

router.post('/' , async(req , res) => {
    try{
        let json = req.body
        let new_otr_customer = new Purchase({
            firstname  : req.body.firstname,
            lastname   : req.body.lastname,
            address1   : req.body.address1,
            town       : req.body.town,
            state      : req.body.state,
            postalcode : req.body.postalcode,
            state      : req.body.state,
            phone      : req.body.phone,
            email      : req.body.email
        })

        await new_otr_customer.save().then((data) => {
            return res.status(200).send(data); 

        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Customer creation error"}); 
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.put('/:id' , async(req  ,res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        
        let json = req.body
        await Purchase.updateOne({_id : id} , {$set : json})
            .then((data) => {
                return res.status(200).send({"err": 0 , "msg" : "Data successfully updated"}); 
            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Not updated"}); 
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.get('/:phone' , async(req , res) => {
    try{
        let phone = req.params.phone
        if(!phone){
            return res.send({"err": 1 , "msg" : "Not a valid phone no."});
        }
        await Purchase.find({phone : phone}).then((data) => {
            return res.send(data)
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in data fetch"}); 
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.put('/status-update/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        let status = req.body.status

        await Purchase.updateOne({_id : id} , {$set : {payment_status : status}})
            .then((data) => {
                return res.status(200).send({"err": 0 , "msg" : "Status updated"});
            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Status not updated"});
            })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

module.exports = router