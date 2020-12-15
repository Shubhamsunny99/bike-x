const mongoose = require('mongoose');
const Joi = require('joi');

const designationSchema = new mongoose.Schema({
    designation_name:String,
    view_vehicle:{ type:Boolean, default:true},
    view_customer:{ type:Boolean, default:true},
    edit_vehicle:{ type:Boolean, default:false},
    view_refurbish:{ type:Boolean, default:false},
    view_procured_price:{ type:Boolean, default:false},
    perform_offine_sell:{ type:Boolean, default:false},
    change_banner:{ type:Boolean, default:false},
    view_agent_activity:{ type:Boolean, default:false},
    add_customer:{ type:Boolean, default:false},
    manage_faq:{ type:Boolean, default:false},
    manage_models:{ type:Boolean, default:false},
    date: { type:Date, default:Date.now},
    updated: { type:Date, default:Date.now}
});  
const Designation = mongoose.model('designation', designationSchema)

function validateDesignation(designation) {
    const schema = {
    designation_name: Joi.string().required(),
    view_vehicle: Joi.boolean(),
    view_customer: Joi.boolean(),
    edit_vehicle: Joi.boolean(),
    view_refurbish:Joi.boolean(),
    view_procured_price:Joi.boolean(),
    perform_offine_sell:Joi.boolean(),
    change_banner:Joi.boolean(),
    view_agent_activity:Joi.boolean(),
    add_customer:Joi.boolean(),
    manage_faq:Joi.boolean(),
    manage_models:Joi.boolean(),
    date:Joi.date(),
    updated: Joi.date()
    };
  
    return Joi.validate(designation, schema);
  }
module.exports.Designation = Designation;
module.exports.validate = validateDesignation;