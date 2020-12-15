const mongoose = require('mongoose');
const Joi = require('joi');

const otrBannersSchema = new mongoose.Schema({
    images        : String,
    path          : String,
    Date          : { type:Date, default:Date.now},
    visibility    : {type: Number, default: 0},
    redirect_url : String
});
const otrBikexbanners = mongoose.model('otr_bikex_banners', otrBannersSchema)

function validateotrbanners(uploadcheck) {
    const schema = {
      images:Joi.string(),
      path:Joi.string(),
      visibility: Joi.number(),
      redirect_url: Joi.string()
    };
  
    return Joi.validate(uploadcheck, schema);
  }
module.exports.otr_bikex_banners = otrBikexbanners;
module.exports.validate = validateotrbanners;