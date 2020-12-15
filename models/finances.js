const mongoose = require('mongoose');
const Joi = require('joi');

const financeSchema = new mongoose.Schema({
    first_name:String,
    last_name: String,
    email: String,
    mobile: Number,
    pincode: Number,
    dob: Date,
    seen:{ type:Number, default:0},
    annual_income: Number,
    vehicle: String,
    date: { type:Date, default:Date.now},
    flag: { type: Number , default : 0},
    comment: String,
    follow_up_date: String
});
const Finance = mongoose.model('finance', financeSchema)

function validatefinance(finance) {
    const schema = {
    first_name:Joi.string().min(1).max(50).required(),
    last_name: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(1).max(100).required(),
    mobile: Joi.number().required(),
    pincode: Joi.number().required(),
    dob: Joi.date().required(),
    annual_income: Joi.number().required(),
    vehicle: Joi.string().min(1).max(50).required(),
    };
  
    return Joi.validate(finance, schema);
  }

module.exports.Finance = Finance;
module.exports.validate = validatefinance;