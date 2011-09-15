/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 7:08 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Comment = module.exports = new Schema({
    name: String
    , email: String
    , message: String
    , createDate: { type:Date, default: Date.now }
});