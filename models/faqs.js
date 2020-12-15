const mongoose = require('mongoose');
const Joi = require('joi');
var uniqid = require('uniqid');

const faqSchema = new mongoose.Schema({
    question:String,
    answer: String,
});
const Faq = mongoose.model('faqs', faqSchema)

function validatefaq(faq) {
    const schema = {
      question: Joi.string().min(5).max(100).required(),
      answer: Joi.string().min(5).max(500).required()
    };
  
    return Joi.validate(faq, schema);
  }
module.exports.Faq = Faq;
module.exports.validate = validatefaq;