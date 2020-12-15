const mongoose = require('mongoose');
const Joi = require('joi');

const festuredBikesSchema = new mongoose.Schema({
    vehicle_id:Number,
    model_id:{type:Number, ref: 'modals'},
});
const Featured = mongoose.model('Featured_Bikes', festuredBikesSchema)

function validatefeatured(featured) {
    const schema = {
        vehicle_id: Joi.number().required(),
        model_id: Joi.number().required()
    };
  
    return Joi.validate(featured, schema);
  }
module.exports.Featured = Featured;
module.exports.validate = validatefeatured;