const {Dealer, validate} = require('../models/dealers');
const express  = require('express');
const router   = express.Router();

// dealer addition
router.post('/' , async(req , res) => {
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

        let dealer = new Dealer({
            name    : req.body.name,
            email   : req.body.email,
            phone   : req.body.phone,
            pincode : req.body.pincode,
            city    : req.body.city,
            state   : req.body.state,
            address : req.body.address,
            comment : req.body.comment,
            status : req.body.status == undefined || req.body.status === "" ? 1 : req.body.status
        })

        await Dealer.findOne({$or : [{phone : req.body.phone}]} , {phone : 1})
            .then(async(check_dealer) => {
               if(check_dealer){
                   if(check_dealer.phone == req.body.phone){
                    return res.send({"err": 1 , "msg" : "Phone already exist"}); 
                   }
               }

               await dealer.save().then((data) => {
                    return res.send(data)
                }).catch((err) => {
                    return res.send({"err": 1 , "msg" : "Dealer addition error"}); 
                })

            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Email and mobile duplication check error"}); 
            })


    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// all list of dealers
router.get('/' , async(req , res) => {
    try{
        await Dealer.find().then((data) => {
            return res.send(data)
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Dealer deatils fetch error"});
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

// dealer individual fetch
router.get('/:id' , async(req , res)  => {
    try{
        let id = req.params.id
        if(!id){
            return res.status(400).send({"err": 1 , "msg" : "Not a valid id"});
        }
        await Dealer.findOne({_id : id}).then((data) => {
            if(!data){
                return res.send({"err": 1 , "msg" : "Dealer data not available"});
            }else{
                return res.send(data)
            }
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Internal Server Error"});
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

// dealer details update
router.put('/:id' , async (req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"});
        }

        const { error } = validate(req.body); 
        if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

        let dealer_obj = {
            name    : req.body.name,
            email   : req.body.email,
            phone   : req.body.phone,
            pincode : req.body.pincode,
            city    : req.body.city,
            state   : req.body.state,
            address : req.body.address,
            comment : req.body.comment,
            status  : req.body.status == undefined || req.body.status === "" ? 1 : req.body.status
        }
        
        let check_phone = await Dealer.findOne({phone : req.body.phone} , {phone : 1})
        if(check_phone){
            if(check_phone._id != id){
                return res.send({"err": 1 , "msg" : "Phone Already Exist"});
            }
        }

        await Dealer.updateOne({_id : id} , {$set : dealer_obj}).then((data) => {
            return res.send({"err": 0 , "msg" : "Dealer updated successfully"});
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in dealer updation"});
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

// dealer deletion
router.delete('/:id' , async (req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.status(400).send({"err": 1 , "msg" : "Not a valid id"});
        }

        await Dealer.deleteOne({_id : id}).then((data) => {
            return res.send({"err": 0 , "msg" : "Dealer deleted successfully"});
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Dealer deletion error"});
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

// change status
router.post('/change_status/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"});
        }
        let status = req.body.status

        await Dealer.updateOne({_id : id} , {$set : {status : status}})
            .then((data) => {
                return res.status(200).send({"err": 0 , "msg" : "Status successfully updated"});
            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Status not updated"}); 
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})


module.exports = router