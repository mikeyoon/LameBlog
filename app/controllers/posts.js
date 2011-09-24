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
    var skip = req.params.page ? req.params.page * 10 : 0;
    var limit = 5;

    Post.find(function(err, data) {
        res.render('post/index', { posts: data });
    }).limit(limit).skip(skip);
};

module.exports.add = function(req, res, next) {
    var Post = req.app.set('db').posts;

    var item = new Post();
    item.title = req.body.post.title;
    item.body = req.body.post.body;
    item.path = '/' + item.title.replace(" ", "_");
    item.tags = req.body.post.tags.split(',');
    item.save(function(err) {
        res.redirect('posts' + item.path);
//        res.send({
//            success: true,
//            path: item.path
//        });
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
        console.log(data);
        res.render('post/view', {
            title: data.title,
            body: data.htmlbody
        });
    });
};

module.exports.renderMarkdown = function(req, res, next) {
    res.render('post/preview', { layout: false, body: md(decodeURIComponent(req.body.data)).replace("<code>", '<code class="brush: js">') });
};