const mongoose = require('mongoose');
const Joi = require('joi');

const premiumSchema = new mongoose.Schema({
    cc: Number,
    price: Number,
    description:String,
    offer_price: String,
});
const Premium = mongoose.model('premiums', premiumSchema)

function validatePremium(premium) {
    const schema = {
      cc: Joi.number().min(10).required(),
      price: Joi.number().integer().required(),
      description: Joi.string().min(5).max(100).required(),
    };
  
    return Joi.validate(premium, schema);
  }
module.exports.Premium = Premium;
module.exports.validate = validatePremium;