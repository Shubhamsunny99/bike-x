const mongoose = require('mongoose');
const Joi      = require('joi');
const shortid  = require('shortid');


const variantModalsSchema = new mongoose.Schema({
    _id     : {type:String, default: shortid.generate},
    name    : String,
    comment : String,
    status  : {type : Number , default: 1}
});
const variantModel = mongoose.model('variants', variantModalsSchema)

function variantModalValidate(modal) {
    const schema = {
        name    : Joi.string().required(),
        comment : Joi.string().required(),
        status  : Joi.number()
    };
  
    return Joi.validate(modal, schema);
  }
  
module.exports.Variant   = variantModel;
module.exports.validate  = variantModalValidate;