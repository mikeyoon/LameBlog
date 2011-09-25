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
    , userType: String
    , facebookToken: String
});

User.statics.getHash = function(password) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(password);
    return sha1.digest('base64');
};

User.statics.setPassword = function(password) {
    this.password = this.getHash(password);
};

User.statics.findByEmailAndPassword = function(email, password, callback) {
    var hash = this.getHash(password);

    this.findOne({ email: email, password: hash}, callback);
};