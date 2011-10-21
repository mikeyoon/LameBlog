/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 10/20/11
 * Time: 9:05 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Tag = module.exports = new Schema({
    name: { type: String, index: true },
    posts: { type: Array, index: true }
});

Tag.statics.removeFromAllTags = function(postId, callback) {
    this.update({ posts: postId }, { $pull: { posts: postId } }, { multi: true }, callback);
};

Tag.statics.addToAllTags = function(tags, postId, callback) {
    var where = {
        $or : []
    };

    tags.forEach(function(tag) {
        where['$or'].push({
            name: tag
        });
    });

    console.log(where);

    this.update(where, { $addToSet: { posts: postId } }, { multi: true }, callback);
};