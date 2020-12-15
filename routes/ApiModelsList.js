const {Model, validate} = require('../models/ApiModelsLists')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
    
    const modelData = await Model.findOne({'name': req.body.name});

    if(modelData){
        res.status(409).send({'msg':'Name already in use!'})
    }else{

    let model = new Model({ 
        name:req.body.name,
        type: req.body.type,
        tags: req.body.tags,
        schema_set: req.body.schema_set
    });
    model.save().then(x=>{
        res.status(201).send({"err": 0, "msg": 'Data entered',"response":x});
    }).catch(x=>{
        res.status(500).send({"err": 1, "msg": x});
    })
    
    }
  });

router.get('/', async (req, res) => {
    const model = await Model.find().sort( { date: -1 });
    res.status(200).send(model);
  });

router.get('/:id', async (req, res) => {
    await Model.find({"_id":req.params.id}).then(x=>{
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
    const model = await Model.findByIdAndUpdate(req.params.id,
        {
            name:req.body.name,
            type: req.body.type,
            tags: req.body.tags,
            schema_set: req.body.schema_set
        },{ new: false })
    
        if(!model){
            res.status(404).send({"err": 1,"response":`Entry with ID '${req.params.id}' not found.`});
        }
        res.status(200).send({"err": 0,"response":model}); 
})

router.delete('/:id', async (req, res) => {
    const model = await Model.findByIdAndDelete(req.params.id)
    if(!model){
        res.status(404).send({"err": 1,"response":`Entry with ID '${req.params.id}' not found.`});
    }    
        res.status(200).send({"err": 0,"response":model});  
  });

module.exports = router;
