const mongoose = require('mongoose');
const Joi = require('joi');
const shortid = require('shortid');

const otr_purchaseSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    firstname : String,
    lastname : String,
    email : String,
    phone : String,
    payment_status : {type : Number , default : 0},
    booking_status : {type : Number , default : 0},
    model_id       : {type: String , ref : "otr_modals"},
    superset_data  : {type : Object , default : {}},
    createdAt      : { type:Date, default:Date.now},
    updatedAt      : { type:Date, default:Date.now},
    amount              : Number,
    razorpay_payment_id : String,
    razorpay_order_id   : String,
    comment             : String,
    gst            : String,
    del_address    : String,
    del_city       : String,
    del_state      : String,
    del_postalCode : String,
    rto_address     : String,
    rto_city        : String,
    rto_state       : String,
    rto_postalCode  : String,
    add_ons          : {type : Array , default : []},
    vehicle_details  : {type : Object , default : {}},
    rating           : String,
    feedback         : String

}); 
const Otr_Purchase = mongoose.model('otr_purchases', otr_purchaseSchema)

function validateOtrPurchase(purchase) {
    const schema = {
        firstname : Joi.string().required(),
        lastname : Joi.string().required(),
        email : Joi.string().required(),
        phone : Joi.string().required(),
        payment_status : Joi.number().required(),
        booking_status : Joi.number().required(),
        model_id : Joi.string().required(),
        superset_data : Joi.object().required(),
        amount : Joi.number().required(),
        razorpay_payment_id : Joi.string(),
        razorpay_order_id : Joi.string(),
        comment : Joi.string(),
        gst : Joi.string(),
        del_address : Joi.string().required(),
        del_city : Joi.string().required(),
        del_state : Joi.string().required(),
        del_postalCode : Joi.string().required(),
        rto_address : Joi.string(),
        rto_city : Joi.string(),
        rto_state : Joi.string(),
        rto_postalCode : Joi.string(),
        add_ons : Joi.array(),
        vehicle_details : Joi.object(),
        rating : Joi.string(),
        feedback : Joi.string()
    };
  
    return Joi.validate(purchase, schema);
  }
module.exports.Otr_Purchase = Otr_Purchase;
module.exports.validate = validateOtrPurchase;