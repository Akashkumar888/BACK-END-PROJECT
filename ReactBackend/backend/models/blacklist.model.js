const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blacklistSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true // Instead of using .index(), better to put it directly here
  }
}, { timestamps: true });

// No need for extra index if you already use `unique` in the schema
// blacklistSchema.index({ token: 1 }, { unique: true });

const Blacklist = mongoose.model("blacklist", blacklistSchema);

module.exports = Blacklist;

