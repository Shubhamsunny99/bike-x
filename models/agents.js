const mongoose = require('mongoose');
const Joi = require('joi');

const agentSchema = new mongoose.Schema({
    agent_username:String,
    password:String,
    email: String,
    phone: Number,
    designation: String,
    view_vehicle:{ type:Boolean, default:true},
    view_customer:{ type:Boolean, default:true},
    edit_vehicle:{ type:Boolean, default:false},
    view_refurbish:{ type:Boolean, default:false},
    view_procured_price:{ type:Boolean, default:false},
    perform_offine_sell:{ type:Boolean, default:false},
    change_banner:{ type:Boolean, default:false},
    view_agent_activity:{ type:Boolean, default:false},
    add_customer:{ type:Boolean, default:false},
    manage_faq:{ type:Boolean, default:false},
    manage_models:{ type:Boolean, default:false},
    date: { type:Date, default:Date.now},
    updated: {type:Date},
}); 
const Agent = mongoose.model('agents', agentSchema)

function validateAgent(agent) {
    const schema = {
      agent_username: Joi.string().min(5).max(50).required(),
      password:Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(50).required(),
      phone: Joi.number().min(10).required(),
      designation: Joi.string().min(2).max(100).required(),
      view_vehicle: Joi.boolean(),
      view_customer: Joi.boolean(),
      edit_vehicle: Joi.boolean(),
      view_refurbish:Joi.boolean(),
      view_procured_price:Joi.boolean(),
      perform_offine_sell:Joi.boolean(),
      change_banner:Joi.boolean(),
      view_agent_activity:Joi.boolean(),
      add_customer:Joi.boolean(),
      manage_faq:Joi.boolean(),
      manage_models:Joi.boolean(),
    };
  
    return Joi.validate(agent, schema);
  }

  function validateAgentEdit(agent) {
    const schema = {
      agent_username: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(50).required(),
      phone: Joi.number().min(10).required(),
      designation: Joi.string().min(2).max(100).required(),
    };
  
    return Joi.validate(agent, schema);
  }

module.exports.Agent = Agent;
module.exports.validate = validateAgent;
module.exports.validateAgentedit = validateAgentEdit;