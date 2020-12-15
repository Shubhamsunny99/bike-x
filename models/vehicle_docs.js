const mongoose = require('mongoose');
const Joi = require('joi');

const docsSchema = new mongoose.Schema({
    images:String,
    path: String,
    type: String,
    agent_name: String,
    vehicle_number: {type:String},
    received: { type:Date, default:Date.now},
    
});
const vehicledocs = mongoose.model('vehicle_docs', docsSchema)

function validatedocs(docscheck) {
    const schema = {
      images:Joi.string(),
      path:Joi.string(),
      type:Joi.string(),
      agent_name:Joi.string(),
      vehicle_number:Joi.string()
    };
  
    return Joi.validate(docscheck, schema);
  }
module.exports.vehicleDocs = vehicledocs;
module.exports.validate = validatedocs;