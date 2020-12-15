const mongoose = require('mongoose');
const Joi = require('joi');

const uploadSchema = new mongoose.Schema({
    vehicle_id:Number,
    images:String,
    path: String
});
const VehicledisplayUploads = mongoose.model('Vehicle_Display_Uploads', uploadSchema)

function validateUploads(uploadcheck) {
    const schema = {
      vehicle_id: Joi.number().required(),
      images:Joi.string(),
    };
  
    return Joi.validate(uploadcheck, schema);
  }
module.exports.VehicledisplayUploads = VehicledisplayUploads;
module.exports.validate = validateUploads;