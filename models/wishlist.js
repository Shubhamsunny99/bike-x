const mongoose = require('mongoose');
const Joi = require('joi');

const wishlistSchema = new mongoose.Schema({
    v_id:Number,
    c_id: String,
});
const Wishlist = mongoose.model('wishlist', wishlistSchema)

function validatewishlist(wishlist) {
    const schema = {
      v_id: Joi.number().required(),
      c_id: Joi.string().min(1).max(500).required()
    };
  
    return Joi.validate(wishlist, schema);
  }
module.exports.Wishlist = Wishlist;
module.exports.validate = validatewishlist;