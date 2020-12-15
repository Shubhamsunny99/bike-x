const mongoose = require('mongoose');
const Joi = require('joi');


const responseSchema = new mongoose.Schema({
    phone_number:String,
    lead_id: String,
    booking_date: String,
    unique_payment_link: String,
    vehicle_interested: String,
    waitlist_vehicle:String,
    waitlist_date:{type : Date},
    lead_responses: Array,
    latest_recording_url:String,
    lead_email:String,
    campaign_id:String,
    latest_called_at:String,
    lead_outcome:String,
    processed_at:String,
    created_at:String,
    Received: { type:Date, default:Date.now}
});
const Response = mongoose.model('squadVoiceResponse', responseSchema)

function validateresponse(message) {
    const schema = {
      message: Joi.string().min(5).required(),
      customer_id: Joi.string().required(),
      agent_id: Joi.string().required(),
      phone: Joi.number().required(),
      agent_username: Joi.string().required()
    };
  
    return Joi.validate(message, schema);
  }

module.exports.Response = Response;
module.exports.validate = validateresponse;
