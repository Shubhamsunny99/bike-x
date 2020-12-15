const {ApiList, validate} = require('../models/apiList')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
    
    // const apiData = await ApiList.findOne({'type': req.body.type});

    // if(apiData){
    //     res.status(409).send({'msg':'Name already in use!'})
    // }else{

    let apiList = new ApiList({ 
        name:req.body.name,
        type: req.body.type,
        discription: req.body.discription,
        payload: req.body.payload,
        sucess_response: req.body.sucess_response,
        failure_response: req.body.failure_response,
        content_type: req.body.content_type,
        Authorization: req.body.Authorization,
        tags: req.body.tags,
        end_point: req.body.end_point,
        query_params: req.body.query_params,

    });
    apiList.save().then(x=>{
        res.status(201).send({"err": 0, "msg": 'Data entered',"response":x});
    }).catch(x=>{
        res.status(500).send({"err": 1, "msg": x});
    })
    
    // }
  });

router.get('/', async (req, res) => {
    const apiList = await ApiList.find().sort( { date: -1 });
    res.status(200).send(apiList);
  });

router.get('/:id', async (req, res) => {
    await ApiList.find({"name":req.params.id}).then(x=>{
        if(x.length > 0){
            res.status(200).send({"err": 0,"response":x});
        }else{
            res.status(404).send({"err": 1,"response":`Entry with ID '${req.params.id}' not found.`});
        }
    }).catch(x=>{
        res.status(500).send({"err": 1, "msg": x});
    })
    
  });

  
router.put('/:id', async (req, res) => {
    const apiList = await ApiList.findByIdAndUpdate(req.params.id,
        {
            name:req.body.name,
            type: req.body.type,
            discription: req.body.discription,
            payload: req.body.payload,
            sucess_response: req.body.sucess_response,
            failure_response: req.body.failure_response,
            content_type: req.body.content_type,
            Authorization: req.body.Authorization,
            tags: req.body.tags,
            end_point: req.body.end_point,
            query_params: req.body.query_params,
        },{ new: false })
    
        if(!apiList){
            res.status(404).send({"err": 1,"response":`Entry with ID '${req.params.id}' not found.`});
        }
        res.status(200).send({"err": 0,"response":apiList}); 
})

router.delete('/:id', async (req, res) => {
    const apiList = await ApiList.findByIdAndDelete(req.params.id)
    if(!apiList){
        res.status(404).send({"err": 1,"response":`Entry with ID '${req.params.id}' not found.`});
    }    
        res.status(200).send({"err": 0,"response":apiList});  
  });

module.exports = router;
