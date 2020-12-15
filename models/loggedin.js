const mongoose = require('mongoose');
const Joi = require('joi');

const loggedinSchema = new mongoose.Schema({
    agent_username:String,
    details:Array,
    date: { type:Date, default:Date.now},
});
const LoggedIn = mongoose.model('loggedIn', loggedinSchema)

function validateAgent(loggedin) {
    const schema = {
    agent_username: Joi.string().min(5).max(50).required(),
    details: Joi.required(),

    };
  
    return Joi.validate(loggedin, schema);
  }
module.exports.LoggedIn = LoggedIn;
module.exports.validate = validateAgent;