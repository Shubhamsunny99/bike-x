const mongoose = require('mongoose');
const Joi = require('joi');


const messageSchema = new mongoose.Schema({
    message:String,
    customer_id: String,
    agent_id: String,
    agent_username: String,
    phone: Number,
    Date: { type:Date, default:Date.now}
});
const Message = mongoose.model('sent_messages', messageSchema)

function validatemessage(message) {
    const schema = {
      message: Joi.string().min(5).required(),
      customer_id: Joi.string().required(),
      agent_id: Joi.string().required(),
      phone: Joi.number().required(),
      agent_username: Joi.string().required()
    };
  
    return Joi.validate(message, schema);
  }
module.exports.Message = Message;
module.exports.validate = validatemessage;