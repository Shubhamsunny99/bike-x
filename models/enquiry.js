const mongoose = require('mongoose');
const Joi = require('joi');
const shortid = require('shortid');


const enquirySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
    },
    name:String,
    bike_name:String,
    mobile: Number,
    email: String,
    status:{type:Number, default:0},
    comment:{type:String, default:'No comment yet'},
    next_action_date: { type:String, default:'NA'},
    walkin_status:{type:Boolean, default:false},
    sold_status:{type:Boolean, default:false},
    walkin_comment:{type:String, default:'No comment yet'},
    date: { type:Date, default:Date.now},
    source:{type:String, default:'BikeX'},
});
const Enquiry = mongoose.model('enquiry', enquirySchema)

function validateEnquiry(enquiry) {
    const schema = {
      name: Joi.string().min(1).max(50).required(),
      bike_name: Joi.string().min(1).max(50).required(),
      mobile: Joi.number().min(10).required(),
      email: Joi.string().min(5).max(100).required(),
      comment: Joi.string(),
      next_action_date:Joi.date(),
      walkin_status:Joi.boolean(),
      sold_status:Joi.boolean(),
      walkin_comment: Joi.string(),
      source: Joi.string()
    };
  
    return Joi.validate(enquiry, schema);
  }
module.exports.Enquiry = Enquiry;
module.exports.validate = validateEnquiry;