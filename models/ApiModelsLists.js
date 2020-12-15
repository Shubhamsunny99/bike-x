const mongoose = require('mongoose');
const Joi = require('joi');

const ModelSchema = new mongoose.Schema({
    name:String,
    type: String,
    tags: String,
    schema_set:Array,
    createdAt: { type:Date, default:Date.now},
    updatedAt: { type:Date, default:Date.now}
});
const Model = mongoose.model('api_model_list', ModelSchema)

function validateModels(model) {
    const schema = {
    name:Joi.string().min(1).max(50).required(),
    type: Joi.string().min(1).max(50).required(),
    tags: Joi.string(),
    schema_set: Joi.array()
    };
  
    return Joi.validate(model, schema);
  }
module.exports.Model = Model;
module.exports.validate = validateModels;