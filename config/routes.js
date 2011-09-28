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

    app.get('/', function(req, res, next) { posts.index(req, res, next) });

    app.get('/posts', function(req, res, next) { posts.index(req, res, next) });

    app.post('/comment/:postId', requiresAuthorization, function(req, res, next) { posts.addComment(req, res, next) });

    app.post('/posts/markdown', function(req, res, next) { posts.renderMarkdown(req, res, next)});

    app.get('/posts/:id', function(req, res, next) { posts.view(req, res, next) });

    app.get('/admin/login', function(req, res, next) { accounts.loginForm(req, res, next) });

    app.post('/admin/login', function(req, res, next) { accounts.login(req, res, next) });

    app.post('/admin/setup', function(req, res, next) { accounts.setup(req, res, next) });

    app.get('/admin', requiresAdmin, function(req, res, next) { accounts.index(req, res, next) });

    app.all('/admin/*', requiresAdmin);
    
    app.post('/admin/posts/add', function(req, res, next) { posts.add(req, res, next) });

    app.get('/admin/posts', function(req, res, next) { posts.index(req, res, next) });

    app.post('/admin/posts/:id', function(req, res, next) { posts.edit(req, res, next) });

    app.delete('/admin/posts/:id', function(req, res, next) { posts.delete(req, res, next) });

    app.post('/admin/media/add', function(req, res, next) { media.add(req, res, next) });

    app.get('/admin/media/index', function(req, res, next) { media.index(req, res, next) });

    app.delete('/admin/media/:id', function(req, res, next) { media.delete(req, res, next) });
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
    if (req.session.user != null && req.session.user.userType == 'admin')
    {
        next();
        return;
    }
    else {
        res.redirect('admin/login');
    }
}