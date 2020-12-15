const mongoose = require('mongoose');
const Joi = require('joi');

const brokerTaskSchema = new mongoose.Schema({

    task_name:String,
    deadline: String,
    broker_id: String,
    assigned_by: String,
    comment: String,
    vehicle_number: String,
    status:{ type:Number, default:0},
    form_28: { type:Boolean, default:false},
    form_29: { type:Boolean, default:false},
    form_30: { type:Boolean, default:false},
    form_34: { type:Boolean, default:false},
    form_35: { type:Boolean, default:false},
    b_extract: { type:Boolean, default:false},
    hypothecation: { type:Boolean, default:false},
    noc: { type:Boolean, default:false},
    createdAt: { type:Date, default:Date.now},
    updatedAt: { type:Date, default:Date.now}
});
const brokerTask = mongoose.model('broker_tasks', brokerTaskSchema)

function validatebrokerTask(broker) {
    const schema = {
    task_name:Joi.string().min(1).max(50).required(),
    deadline: Joi.string().required(),
    broker_id: Joi.string(),
    assigned_by: Joi.string(),
    vehicle_number: Joi.string(),
    comment: Joi.string(),
    status:Joi.number(),
    form_28: Joi.boolean(),
    form_29: Joi.boolean(),
    form_30: Joi.boolean(),
    form_34: Joi.boolean(),
    form_35: Joi.boolean(),
    b_extract: Joi.boolean(),
    hypothecation: Joi.boolean(),
    noc: Joi.boolean(), 
    };
  
    return Joi.validate(broker, schema);
  }
module.exports.brokerTask = brokerTask;
module.exports.validate = validatebrokerTask;