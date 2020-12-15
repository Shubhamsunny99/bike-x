const mongoose = require('mongoose');
const Joi = require('joi');

const sellSchema = new mongoose.Schema({

    make:String,
    model: String,
    engine_cc: String,
    manufacture_year: String,
    name: String,
    seen:{ type:Number, default:0},
    status:{ type:Number, default:0},
    comment:{type:String, default:'No comment yet'},
    next_call_date: { type:String, default:'NA'},
    call_status:{type:Boolean, default:false},
    expected_price: { type:String, default:'NA'},
    offered_price: { type:String, default:'NA'},
    inspection:{type:Boolean, default:false},
    procured_status:{type:Boolean, default:false},
    mobile: Number,
    pincode: Number,
    city: String,
    source: { type:String, default:'BikeX'},
    date: { type:Date, default:Date.now},
});
const Sell = mongoose.model('sells', sellSchema)

function validateSell(sell) {
    const schema = {
    make:Joi.string().min(1).max(50).required(),
    model: Joi.string().min(1).max(50).required(),
    engine_cc: Joi.string().min(1).max(100).required(),
    manufacture_year: Joi.string().min(1).required(),
    name: Joi.string().min(1).max(50).required(),
    pincode: Joi.number(),
    mobile: Joi.number().required(),
    city: Joi.string().min(1).max(50).required(),
    status:Joi.number(),
    comment:Joi.string(),
    next_call_date: Joi.string(),
    call_status:Joi.boolean(),
    expected_price: Joi.string(),
    offered_price: Joi.string(),
    inspection:Joi.boolean(),
    procured_status:Joi.boolean(),
    source:Joi.string(),
    };
  
    return Joi.validate(sell, schema);
  }
module.exports.Sell = Sell;
module.exports.validate = validateSell;