const mongoose = require('mongoose');
const Joi = require('joi');

const docSchema = new mongoose.Schema({
    vehicle_id:Number,
    drc_agent:String,
    drc_amount:Number,
    drc_paysource:String,
    too_agent: String,
    too_amount:Number,
    too_paysource: String,
    customer_name:String,
    noc_date: { type:Date, default:Date.now},
    drc_applied_date: { type:Date, default:Date.now},
    drc_received_date: { type:Date, default:Date.now},
    too_applied_date: { type:Date, default:Date.now},
    too_received_date: { type:Date, default:Date.now},
    handed_date: { type:Date, default:Date.now},
});
const Documents = mongoose.model('bikex_docs', docSchema)

function validatedoc(doc) {
    const schema = {
    vehicle_id:Joi.number(),
    drc_agent:Joi.string(),
    drc_amount:Joi.number(),
    drc_paysource:Joi.string(),
    too_agent: Joi.string(),
    too_amount:Joi.number(),
    too_paysource: Joi.string(),
    customer_name:Joi.string(),
    noc_date: Joi.date(),
    drc_applied_date: Joi.date(),
    drc_received_date: Joi.date(),
    too_applied_date: Joi.date(),
    too_received_date: Joi.date(),
    handed_date: Joi.date(),
    };
  
    return Joi.validate(doc, schema);
  }
module.exports.Documents = Documents;
module.exports.validate = validatedoc;