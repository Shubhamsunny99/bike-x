const mongoose = require('mongoose');
const Joi      = require('joi');
const shortid  = require('shortid');


const otrModalsSchema = new mongoose.Schema({
    _id             : {type:String, default: shortid.generate},
    make            : String,
    model           : String,
    hero_image      : {type: String, default: "https://on-track-jarvis.s3.ap-south-1.amazonaws.com/575ea55b-4581-41ac-8158-3c2437b07fad.png"},
    brand_logo      : {type: String, default: "https://on-track-jarvis.s3.ap-south-1.amazonaws.com/575ea55b-4581-41ac-8158-3c2437b07fad.png"},
    type            : String,
    superset        : [{
        id     : {type:String, default: shortid.generate},
        color  : String,
        price  : Number,
        dealer : {type: String , ref : "dealers"},
        image  : {type: String, default: "https://on-track-jarvis.s3.ap-south-1.amazonaws.com/575ea55b-4581-41ac-8158-3c2437b07fad.png"},
        status : Number,
        variant: {type: String , ref : "variants"},
        hex_color : String,
        additional_cost: {type: Array , default : []},
        description : {type : String , default : "any"},
        add_ons : {type: Array , default : []},
        // add_on : [{
        //     id          : {type:String, default: shortid.generate},
        //     name        : String,
        //     description : {type : String , default : "any"},
        //     price       : String,
        //     status      : {type : Number , default : 0}
        // }]
    }],
    fuel_type       : String,
    displacement    : String,
    mileage         : String,
    weight          : String,
    tank_capacity   : String,
    odometer        : String,
    tyre_type       : String,
    brakes          : String,
    breaking_system : String,
    start_type      : String,
    created_at      : {type:String, default:Date.now},
    created_by      : {type:String, default:Date.now},
    comment         : String,
    about_vehicle   : String,
    manufacturer_url : String,  
    status : {type : Number , default : 0},
    tags    : String
});
const otrModals = mongoose.model('otr_modals', otrModalsSchema)

function otrModalsValidate(modal) {
    const schema = {
        make             : Joi.string().required(),
        model            : Joi.string().required(),
        type             : Joi.string().required(),
        fuel_type        : Joi.string().required(),
        displacement     : Joi.string().required(),
        mileage          : Joi.string().required(),
        weight           : Joi.string().required(),
        tank_capacity    : Joi.string().required(),
        odometer         : Joi.string().required(),
        tyre_type        : Joi.string().required(),
        brakes           : Joi.string().required(),
        breaking_system  : Joi.string().required(),
        start_type       : Joi.string().required(),
        comment          : Joi.string().required(),
        about_vehicle    : Joi.string().required(),
        additional_data  : Joi.array(),
        manufacturer_url : Joi.string(),
        tags             : Joi.string()
    };
  
    return Joi.validate(modal, schema);
  }
  
module.exports.OtrModal = otrModals;
module.exports.validate = otrModalsValidate;