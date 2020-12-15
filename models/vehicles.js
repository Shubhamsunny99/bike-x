const mongoose = require('mongoose');
const Joi = require('joi');

const vehicleSchema = new mongoose.Schema({
    model: String,
    registration_number: Number,
    color:String,
    chassis_number: String,
    engine_number: String,
    year_of_purchase: Date,
    rc_start_date: Date,
    rc_end_date: Date,
    insurance_policy_number: String,
    insurance_end_date: Date,
    manufacture_date: Date,
    price: Number,
    created_date: { type:Date, default:Date.now},
    waitlist: Boolean,
    premium: Boolean,
    file_name: String
});
const Vehicle = mongoose.model('vehicles', vehicleSchema)
function validateVehicle(vehicle) {
    const schema = {
    model: Joi.string().min(5).max(50).required(),
    registration_number: Joi.number().required(),
    color: Joi.string().min(0).max(10).required(),
    chassis_number: Joi.string().min(15).max(35).required(),
    engine_number: Joi.string().min(15).max(35).required(),
    year_of_purchase: Joi.required(),
    rc_start_date: Joi.required(),
    rc_end_date: Joi.required(),
    insurance_policy_number: Joi.string().min(15).max(35).required(),
    insurance_end_date: Joi.required(),
    manufacture_date: Joi.required(),
    price: Joi.number().required(),
    displacement: Joi.string().min(5).max(50).required(),
    waitlist: Joi.required(),
    premium: Joi.required(),
    file_name: Joi.required()
    };
  
    return Joi.validate(vehicle, schema);
  }
module.exports.Vehicles = Vehicle;
module.exports.validate = validateVehicle;