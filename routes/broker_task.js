const {Broker} = require('../models/broker')
const {brokerTask, validate} = require('../models/brokerTasks')

var msg91 = require("msg91")("310801AwwK4rO25e0af36eP1","MBIKEX","4");

const express = require('express');
const router = express.Router();
const msgResponse = ''
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
    
    let broker_task = new brokerTask({ 
        task_name:req.body.task_name,
        deadline: req.body.deadline,
        broker_id: req.body.broker_id,
        assigned_by: req.body.assigned_by,
        vehicle_number: req.body.vehicle_number,
        comment: req.body.comment,
        status:req.body.status,
        form_28: req.body.form_28,
        form_29: req.body.form_29,
        form_30: req.body.form_30,
        form_34: req.body.form_34,
        form_35: req.body.form_35,
        b_extract: req.body.b_extract,
        hypothecation: req.body.hypothecation,
        noc: req.body.noc,
    });
    broker_task.save().then(x=>{
        
        Broker.find({'_id': x.broker_id}).then(y=>{ 
        msg91.send(y[0].phone,`Hi ${y[0].name},
BikeX have assigned you a task, ${x.task_name} of vehicle ${x.vehicle_number}. The deadline for the task is ${x.deadline}. Please stick to the deadline.
Thank you!
        `, function(err, response){
            this.msgResponse = response
          });

        res.status(201).send({"err": 0, "msg": 'Data entered',"response":x});
    })
    }).catch(()=>{
        res.status(500).send({"err": 1, "msg": "Internal Server Down"});
    })
    
  });

router.get('/', async (req, res) => {
    const broker_task = await brokerTask.find().sort( { date: -1 });
    res.status(200).send(broker_task);
  });

router.get('/:id', async (req, res) => {
    await brokerTask.find({"_id":req.params.id}).then(x=>{
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
    const broker = await brokerTask.findByIdAndUpdate(req.params.id,
        {
            name:req.body.name, 
            email: req.body.email,
            phone: req.body.phone,
            alternate_phone: req.body.alternate_phone,
            status:req.body.status,
            charges: req.body.charges,
            does_drc: req.body.does_drc,
            does_to: req.body.does_to,
            does_hc: req.body.does_hc,
        },{ new: false })
    
        if(!broker){
            res.status(404).send({"err": 1,"response":`Entry with ID '${req.params.id}' not found.`});
        }
        res.status(200).send({"err": 0,"response":broker}); 
})

router.delete('/:id', async (req, res) => {
    const broker = await brokerTask.findByIdAndDelete(req.params.id)
    if(!broker){
        res.status(404).send({"err": 1,"response":`Entry with ID '${req.params.id}' not found.`});
    }    
        res.status(200).send({"err": 0,"response":broker});  
  });

module.exports = router;
