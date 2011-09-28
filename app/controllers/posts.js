/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 9:35 PM
 * To change this template use File | Settings | File Templates.
 */

const md = require('node-markdown').Markdown;

module.exports.index = function(req, res, next) {
    var Post = req.app.set('db').posts;
    var skip = req.query.page ? req.query.page * 10 : 0;
    var limit = 5;

    var tags = req.query.tags ? req.query.tags.split(',') : null;
    console.log(tags);
    var query = req.query.search;

    Post.find({ tags: tags }, function(err, data) {
        res.render('post/index', { posts: data, fbAppId: req.app.set('fbAppId') });
    }).limit(limit).skip(skip);
};

module.exports.add = function(req, res, next) {
    var Post = req.app.set('db').posts;

    var item = new Post();
    item.title = req.body.post.title;
    item.body = req.body.post.body;
    item.path = '/' + item.title.replace(/ /g, "_");
    item.tags = req.body.post.tags.split(',');
    item.save(function(err) {
        res.redirect('posts' + item.path);
    });
};

module.exports.delete = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.findById(req.params.id, function(err, data) {
        data.delete();
        res.send({
            success: true
        });
    });
};

module.exports.edit = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.findById(req.params.id, function(err, data) {
        
    });
};

module.exports.view = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.findByPath(req.params.id, function(err, data) {
        res.render('post/view', {
            post: data,
            fbData: {
                fbAppId: req.app.set('fbAppId'),
                ogTitle: data.title,
                ogUrl: 'http://' + req.app.set('host') + ':' + req.app.set('port') + '/posts' + data.path,
                ogSiteName: req.app.set('sitename'),
                ogImageUrl: '',
                ogDescription: ''
            }
        });
    });
};

module.exports.renderMarkdown = function(req, res, next) {
    res.render('post/preview', { layout: false, body: md(decodeURIComponent(req.body.data)).replace("<code>", '<code class="brush: js">') });
};

module.exports.addComment = function(req, res, next) {
    var Post = req.app.set('db').posts;
    var Comment = req.app.set('db').comments;

    Post.findById(req.params.id, function(err, data) {
        var comment = new Comment({
            name: req.body.comment.name,
            email: req.body.comment.email,
            message: req.body.comment.message
        });

        data.comments.push(comment);
        data.save(function(err) {
            res.send(comment);
        });
    });
};

module.exports.getComments = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.findById(req.params.id, function(err, data) {
        res.send(data.comments.slice(req.params.start, req.params.end));
    });
};