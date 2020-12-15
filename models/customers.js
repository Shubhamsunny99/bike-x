const mongoose = require('mongoose');
const Joi = require('joi');
const shortid = require('shortid');


const customerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
    },
    firstname:String,
    lastname:String,
    phone: Number,
    email: String,
    password:String,
    phone_verified: Boolean,
    email_verified:Boolean,
    date: { type:Date, default:Date.now},
    flag: { type: Number , default : 0},
    comment: String,
    follow_up_date: String
});
const Customer = mongoose.model('customers', customerSchema)

function validateCustomer(customer) {
    const schema = {
      firstname: Joi.string().min(1).max(50).required(),
      lastname: Joi.string().min(1).max(50).required(),
      phone: Joi.number().min(10).required(),
      email: Joi.string().min(5).max(100).required(),
      password: Joi.string().min(5).max(100).required(),
      phone_verified: Joi.boolean(),
      email_verified:  Joi.boolean()
    };
  
    return Joi.validate(customer, schema);
  }
module.exports.Customer = Customer;
module.exports.validate = validateCustomer;