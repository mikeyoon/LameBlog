/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 8/31/11
 * Time: 6:40 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var User = module.exports = new Schema({
    username: { type: String, index: true }
    , password: String
    , email: { type: String, index: true }
    , firstName: String
    , lastName: String
    , userType: Number
});

User.statics.findByEmailAndHash = function(email, hash, callback) {
    this.findOne({ email: email, password: hash}, callback);
};

User.statics.setPassword = function(password) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(password);
    this.password = sha1.digest('base64');
};