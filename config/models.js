/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 12:27 AM
 * To change this template use File | Settings | File Templates.
 */

const mongoose = require('mongoose');

/**
 * Exports
 */

module.exports = function(){

    //  Load Blog Post model

    mongoose.model('BlogPost', require('../app/models/blogpost'));

    mongoose.model('User', require('../app/models/user'));

}