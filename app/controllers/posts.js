/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 9:35 PM
 * To change this template use File | Settings | File Templates.
 */

const md = require('node-markdown').Markdown;

const PAGE_SIZE = 2;

module.exports.index = function(req, res, next) {
    var Post = req.app.set('db').posts;
    var skip = req.query.page ? (req.query.page - 1) * PAGE_SIZE : 0;
    var limit = PAGE_SIZE;

    var where = { };

    console.log(req.query.tags);
    if (req.query.tags)
        where.tags = req.query.tags;

    var query = req.query.search;

    Post.count(where, function(err, postCount) {
        var pages = [];// = new Array();
        for (var ii = 0;ii < Math.ceil(postCount / PAGE_SIZE);ii++)
            pages.push(ii + 1);

        Post.find(where, [], { sort: [ [ 'publishDate', 'descending' ] ], limit: PAGE_SIZE, skip: skip }, function(err, data) {
            res.render('post/index', {
                layout: false,
                posts: data,
                fbAppId: req.app.set('fbAppId'),
                pageCount: pages.length,
                pages: pages,
                currentPage: req.query.page ? req.query.page : 1
            });
        });
    });
};

module.exports.search = function(req, res, next) {
    
};

module.exports.getPost = function(req, res, next) {
    var Post = req.app.set('db').posts;
    
    Post.findByPath(req.params.id, function(err, data) {
        if (data)
        {
            res.render('post/view', {
                layout: false,
                post: data,
                fbData: {
                    fbAppId: req.app.set('fbAppId'),
                    ogTitle: req.app.set('site_name') + ' - ' + data.title,
                    ogUrl: 'http://' + req.app.set('domain') + '/posts' + data.path,
                    ogSiteName: req.app.set('sitename'),
                    ogImageUrl: 'http://' + req.app.set('domain') + '/public/images/logo.png',
                    ogDescription: ''
                }
            });
        }
        else {
            res.redirect('/');
        }
    });
};

module.exports.renderMarkdown = function(req, res, next) {
    res.render('post/preview', { layout: false, body: md(decodeURIComponent(req.body.data)) });
};

module.exports.addComment = function(req, res, next) {
    var Post = req.app.set('db').posts;
    var Comment = req.app.set('db').comments;

    Post.findById(req.params.postId, function(err, data) {
        var comment = new Comment({
            name: req.body.comment.name,
            email: req.body.comment.email,
            message: req.body.comment.message
        });

        if (!data.comments)
            data.comments = [ ];

        data.comments.push(comment);
        data.save(function(err) {
            res.send({
                name: comment.name,
                message: comment.message,
                displayDate: comment.displayDate
            });
        });
    });
};

module.exports.getComments = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.findById(req.params.id, function(err, data) {
        res.send({
            comments: data.comments.slice(req.params.start, req.params.end),
            totalComments: data.comments.length
        });
    });
};