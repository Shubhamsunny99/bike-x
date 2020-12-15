const mongoose = require('mongoose');
const Joi = require('joi');

const refurbishSchema = new mongoose.Schema({
    vehicle_number:Number,
    total_cost:Number,
    parts_changed:Array,
    comments:String,
    date: { type:Date, default:Date.now},
    updated: { type:Date, default:Date.now}
}); 
const Refurbished = mongoose.model('refurbished_list', refurbishSchema)

function validateRefurbishment(refurbish) {
    const schema = {
    vehicle_number: Joi.number().required(),
    total_cost: Joi.required(),
    parts_changed: Joi.required(),
    comments: Joi.string().min(1).max(100),
    date:Joi.date(),
    updated: Joi.date()
    };
  
    return Joi.validate(refurbish, schema);
  }
module.exports.Refurbished = Refurbished;
module.exports.validate = validateRefurbishment;