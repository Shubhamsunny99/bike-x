const {Variant, validate} = require('../models/variants');
const express  = require('express');
const router   = express.Router();

// add varaint
router.post('/' , async(req , res) => {
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

        let varient = new Variant({
            name : req.body.name,
            comment : req.body.comment,
            status: req.body.status == undefined || req.body.status === "" ? 1 : req.body.status
        })

        await varient.save().then((data) => {
            return res.send(data);

        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Varient addition error"});
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// list variant
router.get('/' , async(req , res) => {
    try{
        await Variant.find().then((data) => {
            return res.send(data)
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Variant fetch error"}); 
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});  
    }
})

// fetch individual variant
router.get('/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"});  
        }
        await Variant.findOne({_id : id}).then((data) => {
            if(!data){
                return res.send({"err": 1 , "msg" : "Variant not found"}); 
            }else{
                return res.send(data)
            }
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Variant fetch error"}); 
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});  
    }
})

// update variant
router.put('/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"});  
        }
        const { error } = validate(req.body); 
        if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

        let varient = {
            name    : req.body.name,
            comment : req.body.comment,
            status  : req.body.status == undefined || req.body.status === "" ? 1 : req.body.status
        }

        await Variant.updateOne({_id : id} , {$set : varient}).then((data) => {
            return res.send({"err": 0 , "msg" : "Variant updated successfully"});  

        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Variant updation error"});  
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});  
    }
})

// delete variant
router.delete('/:id' , async (req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }

        await Variant.deleteOne({_id : id}).then((data) => {
            return res.send({"err": 0 , "msg" : "Variant deleted successfully"}); 

        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Variant deletion error"}); 
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// variant name duplicacy check
router.post('/check-variant' , async(req , res) => {
    try{
        let name = req.body.name

        await Variant.findOne({name : name} , {name : 1}).then((data) => {
            if(!data){
                return res.send({"err": 1 , "msg" : "Varaint already exist"}); 
            }else{
                return res.send({"err": 0 , "msg" : "Variant not exist"}); 
            }
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Variant fetch error"}); 
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

module.exports = router