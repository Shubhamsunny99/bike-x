const mongoose = require('mongoose');
const Joi = require('joi');

const ApiSchema = new mongoose.Schema({
  name:String,
  type: String,
  discription: String,
  payload: Array,
  sucess_response: String,
  failure_response: String,
  content_type: String,
  Authorization: String,
  query_params:String,
  end_point:String,
  tags: String,
  createdAt: { type:Date, default:Date.now},
  updatedAt: { type:Date, default:Date.now}
});
const ApiList = mongoose.model('BikeX_Api', ApiSchema)

function validateModels(model) {
    const schema = {
    name:Joi.string().min(1).max(50).required(),
    type: Joi.string().min(1).max(50).required(),
    discription:Joi.string().min(1).max(50).required(),
    payload: Joi.array().required(),
    sucess_response:Joi.string().required(),
    failure_response:Joi.string().required(),
    content_type:Joi.string().min(1).max(50).required(),
    Authorization: Joi.string().min(1).max(50).required(),
    tags: Joi.string(),
    query_params: Joi.string(),
    end_point: Joi.string(),
    };
  
    return Joi.validate(model, schema);
  }
module.exports.ApiList = ApiList;
module.exports.validate = validateModels;