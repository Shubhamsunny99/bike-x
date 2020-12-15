const {LoggedIn, validate} = require('../models/loggedin')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  
    let loggedIn = new LoggedIn({ 
    agent_username: req.body.agent_username,
    details: req.body.details,
    });
    loggedIn = await loggedIn.save();
    res.send({"err": 0, "loggedIn": loggedIn});
  });

router.get('/', async (req, res) => {
    const loggedIn = await LoggedIn.find();
    res.send(loggedIn);
  });

module.exports = router;
