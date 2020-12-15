const {AgentActivity, validate} = require('../models/agentactivity')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  
    let agentActivity = new AgentActivity({ 
    agent_username: req.body.agent_username,
    activity: req.body.activity,
    details: req.body.details
    });
    agentActivity = await agentActivity.save();
    res.send({"err": 0, "agentActivity": agentActivity});
  });

router.get('/', async (req, res) => {
    const agentActivity = await AgentActivity.find().sort( { date: -1 });
    res.send(agentActivity);
  });

module.exports = router;
