const mongoose = require('mongoose');
const Joi = require('joi');
const shortid = require('shortid');

const purchaseSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    customer_id:String,
    vehicle_id:Number,
    firstname:String,
    lastname:String,
    phone: Number,
    tefflon: Number,
    extended_w: Number,
    rsa: Number,
    comprehensive: Number,
    delivery:{ type:Number, default:0},
    amount: Number,
    email: String,
    address1:String,
    address2:String,
    image:String,
    seen:{ type:Number, default:0},
    model:String,
    mode_of_payment:String,
    state:String,
    postalcode: Number,
    razorpay_order_id:String,
    razorpay_payment_id:String,
    razorpay_signature:String,
    source:{ type:String, default:'web'},
    payment_status:{ type:Number, default:0},
    date: { type:Date, default:Date.now},
}); 
const Purchase = mongoose.model('purchase', purchaseSchema)

function validatePurchase(purchase) {
    const schema = {
    customer_id:Joi.string().required(),
    vehicle_id:Joi.number().required(),
    firstname: Joi.string().min(1).max(50).required(),
    lastname: Joi.string().min(1).max(50).required(),
    phone: Joi.number().min(10).required(),
    tefflon: Joi.number(),
    extended_w: Joi.number(),
    rsa: Joi.number(),
    comprehensive: Joi.number(),
    delivery: Joi.number(),
    amount: Joi.number().min(0).required(),
    email: Joi.string().min(5).max(100).required(),
    address1: Joi.string().min(5).max(100).required(),
    address2: Joi.string(),
    town: Joi.string().min(1).max(50).required(),
    state: Joi.string().min(1).max(50).required(),
    postalcode: Joi.number().required(),
    razorpay_order_id:Joi.string(),
    image:Joi.string(),
    mode_of_payment:Joi.string(),
    model:Joi.string(),
    source:Joi.string(),
    razorpay_payment_id:Joi.string(),
    razorpay_signature:Joi.string(),
    payment_status:Joi.number(),
    };
  
    return Joi.validate(purchase, schema);
  }
module.exports.Purchase = Purchase;
module.exports.validate = validatePurchase;