const mongoose = require('mongoose');
const Joi = require('joi');

const uploadSchema = new mongoose.Schema({
    vehicle_id:Number,
    images:Array,
    path: String
});
const VehicleUploads = mongoose.model('VehicleUploads', uploadSchema)

function validateUploads(uploadcheck) {
    const schema = {
      vehicle_id: Joi.number().required(),
      images:Joi.array(),
    };
  
    return Joi.validate(uploadcheck, schema);
  }
module.exports.VehicleUploads = VehicleUploads;
module.exports.validate = validateUploads;