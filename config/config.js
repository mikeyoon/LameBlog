/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 12:27 AM
 * To change this template use File | Settings | File Templates.
 */

    const express = require('express')
    , mongoose = require('mongoose')
    , storage = require('../lib/storage')(process.env.STORAGE_PLATFORM || 'localfilestorage')
    , form = require('connect-form')
    , FacebookClient = require('facebook-client').FacebookClient;

/**
 *  Exports
 */

module.exports = function(app) {

    //  Setup DB Connection

    var dblink = process.env.MONGOLAB_URI || 'mongodb://localhost/lameblog';

    const db = mongoose.createConnection(dblink);

    //  Configure expressjs
    app.configure(function() {
        app.set('site_name', 'Mike\'s Musings');
    });

    app.configure(function () {
        this
            .use(express.cookieParser())
            .use(form({ keepExtensions: true}))
            .use(express.bodyParser())
            .use(express.errorHandler({dumpException: true, showStack: true}));
    });

    //  Add template engine

    app.configure(function() {
        this
            .set('views', __dirname + '/../app/views')
            .set('view engine', 'jade')
            .set('view options', {
                layout: false,
                pageTitle: this.set('site_name')
            })
            .use('/public', express.static(__dirname + '/../public'));
    });

    //  Save reference to database connection

    app.configure(function () {
        app.set('db', {
            'main': db
            , 'users': db.model('User')
            , 'posts': db.model('BlogPost')
            , 'media': db.model('MediaItem')
            , 'tag': db.model('Tag')
            , 'comments': db.model('Comment')
        });

        app.set('fbAppId', process.env.FACEBOOK_APP_ID);

        app.set('sitename', 'LameBlog');

        app.set('version', '1.0.0');
    });

    app.configure(function() {
        var fbClient = new FacebookClient(
            process.env.FACEBOOK_APP_ID,
            process.env.FACEBOOK_APP_SECRET
        );

        app.set('fbClient', fbClient);
    });

    //  Configure File Storage

    app.configure(function() {
        app.set('media', storage);
    });

    return app;
}