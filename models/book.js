var mongoose = require('mongoose');

var BookSchema = mongoose.Schema({
  title: String,
  author: String,
  numPages: Number
});

// Add virtual field 'id' which equals '_id'.
BookSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BookSchema.set('toObject', {
  virtuals: true
});

// Remove underscore prefix fields from output
BookSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
}

module.exports = mongoose.model('book', BookSchema);
