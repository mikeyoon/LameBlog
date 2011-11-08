/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 12:37 AM
 * To change this template use File | Settings | File Templates.
 */

const dateformat = require("dateformat")
    , time = require('time');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Comment = require('./comment'),
    ObjectId = Schema.ObjectId,
    md = require('node-markdown').Markdown;

var BlogPost = module.exports = new Schema({
    owner: ObjectId
    , title: { type: String, unique: true }
    , body: { type: String, index: true }
    , path: { type: String, index: true, unique: true }
    , comments: [Comment]
    , tags: { type: Array, index: true }
    , views: Number
    , publishDate: { type: Date, index: true }
    , hidden: Boolean
    , createDate: { type: Date, default: Date.now }
});

BlogPost.virtual('htmlbody').get(function() {
    return md(this.body);
});

BlogPost.virtual('commentCount').get(function() {
    return this.comments.length;
});

BlogPost.virtual('displayDate').get(function() {
    var ex = time.extend(this.publishDate);
    ex.setTimezone('America/Los_Angeles');
    return dateformat(ex, 'mm-dd-yyyy hh:MM TT Z');
});

BlogPost.virtual('localTime').get(function() {
    var ex = time.extend(this.publishDate);
    ex.setTimezone('America/Los_Angeles');
    return dateformat(ex, 'mm-dd-yyyy hh:mm TT');
});

BlogPost.statics.findByPath = function(path, callback) {
    this.findOne({ path: '/' + path }, callback);
};