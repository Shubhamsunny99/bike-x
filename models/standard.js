const mongoose = require('mongoose');
const Joi = require('joi');

const standardSchema = new mongoose.Schema({
    cc: Number,
    price: Number,
    description:String,
    offer_price: String,
});
const Standard = mongoose.model('standards', standardSchema)

function validatestandard(standard) {
    const schema = {
      cc: Joi.number().min(10).required(),
      price: Joi.number().integer().required(),
      description: Joi.string().min(5).max(100).required(),
    };
  
    return Joi.validate(standard, schema);
  }
module.exports.Standard = Standard;
module.exports.validate = validatestandard;