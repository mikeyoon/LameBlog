/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 6:54 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MediaItem = module.exports = new Schema({
    filename: String
    , filetype: String
    , url: String
    , size: Number
    , createDate: { type: Date, default: Date.now }
});