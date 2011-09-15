/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 6:42 PM
 * To change this template use File | Settings | File Templates.
 */



module.exports = function(storage) {
    var store = require('./storage/' + storage);

    module.exports.saveFile = store.saveFile;
    module.exports.deleteFile = store.deleteFile;
};