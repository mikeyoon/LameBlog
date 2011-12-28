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

module.exports = function(app) {

    //  Load Blog Post model
    var BlogPost = require('../app/models/blogpost');
    var caching = app.set('caching');



    mongoose.model('BlogPost', BlogPost);

    //Wipe caching when needed
    BlogPost.post('save', function(data) {
        client.del(data.path);
        client.hkeys(caching.queryKey, function(err, reply) {
            if (reply) {
                reply.forEach(function(p) {
                    client.hdel(caching.queryKey, p);
                });
            }
        });
    });

    BlogPost.post('remove', function() {
        client.del(this.path);
        client.hkeys(caching.queryKey, function(err, reply) {
            if (reply) {
                reply.forEach(function(p) {
                    client.hdel(caching.queryKey, p);
                });
            }
        });
    });

    mongoose.model('Comment', require('../app/models/comment'));

    mongoose.model('User', require('../app/models/user'));

    mongoose.model('MediaItem', require('../app/models/mediaItem'));

    mongoose.model('Tag', require('../app/models/tag'));

    var db = app.set('dbConnection');
    app.configure(function () {
        app.set('db', {
            'users': db.model('User')
            , 'posts': db.model('BlogPost')
            , 'media': db.model('MediaItem')
            , 'tag': db.model('Tag')
            , 'comments': db.model('Comment')
        });
    });
}