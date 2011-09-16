/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 12:27 AM
 * To change this template use File | Settings | File Templates.
 */

const home = require('../app/controllers/home')
    , posts = require('../app/controllers/posts')
    , accounts = require('../app/controllers/accounts')
    , media = require('../app/controllers/media');

module.exports = function(app) {

    var db = app.set('db');

    app.get('/', function(req, res, next) { home.index(req, res, next) });

    app.get('/posts', function(req, res, next) { posts.index(req, res, db, next) });

    app.post('/comment/:postId', requiresAuthorization, function(req, res, next) { posts.addComment(req, res, next) });

    app.get('/admin', requiresAdmin, function(req, res, next) { accounts.index(req, res, next) });

    app.get('/admin/posts/add', requiresAdmin, function(req, res, next) { home.index(req, res, next) });

    app.get('/admin/posts/edit', requiresAdmin, function(req, res, next) { home.index(req, res, next) });

    app.post('/admin/posts/edit', requiresAdmin, function(req, res, next) { home.index(req, res, next) });

    app.post('/admin/media/add', function(req, res, next) { media.add(req, res, next) });

};

function requiresAuthorization(req, res, next) {
    if (req.session.user != null)
    {
        next();
        return;
    }
    else {
        next(new Error('Unauthorized'));
    }
}

function requiresAdmin(req, res, next) {
    if (req.session.user != null && req.session.user.userType == 10)
    {
        next();
        return;
    }
    else {
        next(new Error('Admin rights required'));
    }
}