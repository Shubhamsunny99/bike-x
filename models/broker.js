const mongoose = require('mongoose');
const Joi = require('joi');

const brokerSchema = new mongoose.Schema({

    name:String,
    email: String,
    phone: Number,
    alternate_phone: Number,
    status:{ type:Number, default:0},
    does_drc: { type:Boolean, default:false},
    does_to: { type:Boolean, default:false},
    does_hc: { type:Boolean, default:false},
    charges: {type:Number, default: 0},
    createdAt: { type:Date, default:Date.now},
    updatedAt: { type:Date, default:Date.now}
});
const Broker = mongoose.model('broker_list', brokerSchema)

function validateBroker(broker) {
    const schema = {
    name:Joi.string().min(1).max(50).required(),
    email: Joi.string().min(1).max(50).required(),
    phone: Joi.number().required(),
    alternate_phone: Joi.number(),
    // status: Joi.number(),
    tags: Joi.string(),
    does_drc: Joi.boolean(),
    does_to: Joi.boolean(),
    does_hc: Joi.boolean(),
    charges: Joi.number(),
    };
  
    return Joi.validate(broker, schema);
  }
module.exports.Broker = Broker;
module.exports.validate = validateBroker;