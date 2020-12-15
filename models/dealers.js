const mongoose = require('mongoose');
const Joi      = require('joi');
const shortid  = require('shortid');


const dealerModalsSchema = new mongoose.Schema({
    _id     : {type:String, default: shortid.generate},
    name    : String,
    email   : String,
    phone   : String,
    pincode : Number,
    city    : String,
    state   : String,
    address : String,
    comment : String,
    status  : {type: Number , default: 1},
});
const dealerModals = mongoose.model('dealers', dealerModalsSchema)

function dealerModalsValidate(modal) {
    const schema = {
        name    : Joi.string().required(),
        email   : Joi.string().required(),
        phone   : Joi.string().required(),
        pincode : Joi.number().required(),
        city    : Joi.string(),
        state   : Joi.string(),
        address : Joi.string().required(),
        comment : Joi.string().required(),
        status  : Joi.number()
    };
  
    return Joi.validate(modal, schema);
  }
  
module.exports.Dealer   = dealerModals;
module.exports.validate = dealerModalsValidate;