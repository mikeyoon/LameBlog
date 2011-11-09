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
    , admin = require('../app/controllers/admin')
    , media = require('../app/controllers/media')
    , querystring = require('querystring');


module.exports = function(app) {

    var db = app.set('db');

    app.get('/', function(req, res, next) { posts.index(req, res, next) });

    app.get('/admin', requiresAdmin, function(req, res, next) { admin.index(req, res, next) });

    app.get('/:id', function(req, res, next) { posts.getPost(req, res, next) });

    app.post('/comment/:postId', requiresAuthorization, function(req, res, next) { posts.addComment(req, res, next) });

    app.post('/posts/markdown', function(req, res, next) { posts.renderMarkdown(req, res, next)});

    app.get('/posts/:id', function(req, res, next) { posts.getPost(req, res, next) });

    app.get('/admin/login', function(req, res, next) { accounts.loginForm(req, res, next) });

    app.post('/admin/login', function(req, res, next) { accounts.login(req, res, next) });

    app.post('/admin/setup', function(req, res, next) { accounts.setup(req, res, next) });

    app.all('/admin/*', requiresAdmin);

    app.post('/admin/tags/:name', function(req, res, next) { admin.addTag(req, res, next) });
    
    app.post('/admin/posts/add', function(req, res, next) { admin.addPost(req, res, next) });

    app.get('/admin/posts/add', function(req, res, next) { admin.newPost(req, res, next) });

    app.get('/admin/posts', function(req, res, next) { admin.getPosts(req, res, next) });

    app.get('/admin/posts/:id', function(req, res, next) { admin.getPost(req, res, next) });

    app.post('/admin/posts/:id', function(req, res, next) { admin.editPost(req, res, next) });

    app.post('/admin/posts/delete/:id', function(req, res, next) { admin.deletePost(req, res, next) });

    app.post('/admin/media/add', function(req, res, next) { media.add(req, res, next) });

    app.get('/admin/media', function(req, res, next) { media.index(req, res, next) });

    app.get('/admin/media/imagepicker', function(req, res, next) { media.picker(req, res, next) });

    app.post('/admin/media/images/json/:page', function(req, res, next) { media.getImagesAsJson(req, res, next) });

    app.delete('/admin/media/:id', function(req, res, next) { media.delete(req, res, next) });
};

function requiresAuthorization(req, res, next) {
    var fb = req.app.set('fbClient');
    fb.getSessionByRequestHeaders(req.headers)(function(fb_session) {
        if (fb_session)
        {
            fb_session.isValid()(function(is_valid) {
                if (is_valid){
                    next();
                    return;
                }

                next(new Error('Unauthorized'));
            });
        }
        else {
            next(new Error('Unauthorized'));
        }

    });
}

function requiresAdmin(req, res, next) {
    if (req.session.user != null && req.session.user.userType == 'admin')
    {
        next();
        return;
    }
    else {
        res.redirect('/admin/login');
    }
}