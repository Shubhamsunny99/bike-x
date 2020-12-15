const {Agent, validate, validateAgentedit} = require('../models/agents')
const express = require('express');
const router = express.Router();
var passwordHash = require('password-hash');

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  
    let agent = new Agent({ 
    agent_username: req.body.agent_username,
    password: passwordHash.generate(req.body.password),
    email: req.body.email,
    phone: req.body.phone,
    designation: req.body.designation,
    });
    agent = await agent.save();
    res.send({"err": 0, "agent": agent});
  }); 

router.get('/', async (req, res) => {
    const agents = await Agent.find().sort( { date: -1 }).select("-password");
    res.send(agents);
  });

  router.get('/:id', async (req, res) => {
    const agents = await Agent.findById(req.params.id).select("-password");
    res.send(agents);
  });

  router.post('/changepassword', async (req, res) => {
     const agent = await Agent.find({"_id": req.body.id});
     if(agent){
       for( var i in agent){
         if(passwordHash.verify(req.body.currentpassword,agent[i].password)){
           const agentupdated = await Agent.findByIdAndUpdate(req.body.id,
             {
               password: passwordHash.generate(req.body.newpassword)
           },{new: false})

           if(!agentupdated) return res.status(404).send('Some error occured.');

           res.send({err:0,msg:'Password Changed Sucessfull.',agentupdated});
          
         }else{
           res.send({err:1,msg:'Invalid Old Password.'});
         }
       }
     }
   })
  router.post('/validate', async (req, res) => {

    const admin = await Agent.find({"email":req.body.email});
    if(admin){
      for( var i in admin){
        if(passwordHash.verify(req.body.password,admin[i].password)){
          res.send({err:0,msg:'Sucessfull', data:admin});
        }else{
          res.send({err:1,msg:'Invalid Password'});
        }
      }
    }
      res.send({err:1,msg:'Email is not registered with us..'});
  });

  router.put('/:id', async (req, res) => {

    const { error } = validateAgentedit(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
    const agent = await Agent.findByIdAndUpdate(req.params.id,
      { 
        agent_username: req.body.agent_username,
        email: req.body.email,
        phone: req.body.phone,
        designation: req.body.designation,
        updated: Date.now()
      }, { new: true });
  
    if (!agent) return res.status(404).send('The agent with the given ID was not found.');
    
    res.send(agent);
  });
  router.put('/update/:id', async (req, res) => {

    const admin = await Agent.findById(req.params.id);
    if(admin){
     
        if(passwordHash.verify(req.body.password,admin.password)){

          const { error } = validate(req.body); 
          if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
          
          const agent = await Agent.findByIdAndUpdate(req.params.id,
            { 
              agent_username: req.body.agent_username,
              email: req.body.email,
              phone: req.body.phone,
              designation: req.body.designation,
              updated: Date.now()
            }, { new: true });
        
          if (!agent) return res.status(404).send('The agent with the given ID was not found.');
          
          res.send({err:1,msg:'Profile has been updated.',agent});

        }else{
          return  res.status(404).send({err:1,msg:'Incorrect Password. Password is case-sensitive.'})
        }
    }else{
      res.send('Agent not Found')
    }
  });

  router.delete('/:id', async (req, res) => {
    const agent = await Agent.findByIdAndRemove(req.params.id);
  
    if (!agent) return res.status(404).send('The agent with the given ID was not found.');
  
    res.send(agent);
  });

  router.put('/permission/view_vehicle/:id', async (req, res) => {
    if(req.body.permissionfor == 'view_vehicle'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          view_vehicle: req.body.view_vehicle,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'edit_vehicle'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          edit_vehicle: req.body.edit_vehicle,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'view_customer'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          view_customer: req.body.view_customer,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'add_customer'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          add_customer: req.body.add_customer,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'view_refurbish'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          view_refurbish: req.body.view_refurbish,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'view_procured_price'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          view_procured_price: req.body.view_procured_price,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'perform_offine_sell'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          perform_offine_sell: req.body.perform_offine_sell,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'change_banner'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          change_banner: req.body.change_banner,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'view_agent_activity'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          view_agent_activity: req.body.view_agent_activity,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'manage_faq'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          manage_faq: req.body.manage_faq,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else if(req.body.permissionfor == 'manage_models'){
      const agent = await Agent.findByIdAndUpdate(req.params.id,
        { 
          manage_models: req.body.manage_models,
          updated: Date.now()
        }, { new: true });
      if (!agent) return res.status(404).send('The agent with the given ID was not found.'); 
      return res.send(agent);
    }else{
      return res.status(404).send('Not Authorized to perform this Action.'); 
    }
  });

  

module.exports = router;
