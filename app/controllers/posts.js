/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 9:35 PM
 * To change this template use File | Settings | File Templates.
 */

module.exports.index = function(req, res, db, next) {
    var posts = db.posts.find(function(err, data) {
        console.log(posts);
        res.send('Posts go here');
    });
};

