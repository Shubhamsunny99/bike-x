const mongoose = require('mongoose');
const Joi = require('joi');

const centreSchema = new mongoose.Schema({
    code:Number,
    phone:Number,
    address: String,
});
const Centres = mongoose.model('centres', centreSchema)

function validatecentre(centre) {
    const schema = {
      code: Joi.number().integer().required(),
      phone: Joi.number().integer().required(),
      address: Joi.string().min(5).max(500).required()
    };
  
    return Joi.validate(centre, schema);
  }
module.exports.Centres = Centres;
module.exports.validate = validatecentre;