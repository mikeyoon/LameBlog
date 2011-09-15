/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 12:37 AM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Comment = require('./comment');
    ObjectId = Schema.ObjectId;

var BlogPost = module.exports = new Schema({
    owner: ObjectId
    , title: String
    , body: { type: String, index: true }
    , firstName: String
    , path: { type: String, index: true }
    , comments: [Comment]
    , createDate: { type: Date, default: Date.now }
});

BlogPost.statics.findByPath = function(path, callback) {
    this.findOne({ path: path }, callback);
};