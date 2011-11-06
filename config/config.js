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
    , FacebookClient = require('facebook-client').FacebookClient
    , argv = require('optimist').argv
    , params = require(argv._[0])
    , knox = require('knox');

/**
 *  Exports
 */

module.exports = function(app) {

    var client = knox.createClient({
        key: params.s3Key
        , secret: params.s3Secret
        , bucket: params.s3Bucket
    });

    //  Setup DB Connection

    var dblink = process.env.MONGOLAB_URI || 'mongodb://localhost/lameblog';

    const db = mongoose.createConnection(dblink);

    //  Configure expressjs
    app.configure(function() {
        app.set('params', params);
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
                pageTitle: params.site_title,
                siteAuthor: params.author
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

        app.set('fbAppId', params.facebookAppId);
        app.set('sitename', params.site_title);

        app.set('version', '1.0.0');
    });

    app.configure(function() {
        var fbClient = new FacebookClient(
            params.facebookAppId,
            params.facebookSecret
        );

        app.set('fbClient', fbClient);

        app.set('s3', client);
    });

    //  Configure File Storage

    app.configure(function() {
        app.set('media', storage);
    });

    return app;
}