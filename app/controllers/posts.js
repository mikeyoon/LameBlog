/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 9:35 PM
 * To change this template use File | Settings | File Templates.
 */

const md = require('node-markdown').Markdown
    , flow = require('flow');

const PAGE_SIZE = 10;

module.exports.index = function(req, res, next) {
    var Post = req.app.set('db').posts;
    var Tag = req.app.set('db').tag;
    
    var skip = req.query.page ? (req.query.page - 1) * PAGE_SIZE : 0;
    var limit = PAGE_SIZE;

    var where = { };

    console.log(req.query.tags);
    if (req.query.tags)
        where.tags = req.query.tags;

    var query = req.query.search;

    var allTags;
    var pages = [];

    flow.exec(
        function() {
            Post.count(where, this);
        }, function(err, postCount) {
            for (var ii = 0;ii < Math.ceil(postCount / PAGE_SIZE);ii++)
                pages.push(ii + 1);

            Tag.find({  }, this);
        }, function(err, data) {
            allTags = data.map(function(p) {
                return {
                    name: p.name,
                    count: p.posts.length
                };
            }).filter(function(p) {
                return p.count;
            });

            Post.find(where, [], { sort: [ [ 'publishDate', 'descending' ] ], limit: PAGE_SIZE, skip: skip }, this);
        }, function(err, data) {
            res.render('post/index', {
                layout: false,
                posts: data,
                fbAppId: req.app.set('fbAppId'),
                pageCount: pages.length,
                pages: pages,
                currentPage: req.query.page ? req.query.page : 1,
                tags: allTags
            });
        }
    );
};

module.exports.search = function(req, res, next) {
    
};

module.exports.getPost = function(req, res, next) {
    var Post = req.app.set('db').posts;

    //Get posts with same tags
    Post.findByPath(req.params.id, function(err, data) {
        if (data)
        {
            Post.find({ _id: { $ne: data._id } }, [], { sort: [ [ 'publishDate', 'descending' ] ], limit: 3 }, function(err3, recent) {
                Post.find({ tags: { $in : data.tags }, _id: { $ne : data._id } }, [], { sort: [ [ 'publishDate', 'descending' ] ], limit: 3 }, function(err2, tagged) {
                    res.render('post/view', {
                        layout: false,
                        post: data,
                        recent: recent,
                        related: tagged,
                        fbData: {
                            fbAppId: req.app.set('fbAppId'),
                            ogTitle: req.app.set('site_name') + ' - ' + data.title,
                            ogUrl: 'http://' + req.app.set('domain') + '/posts' + data.path,
                            ogSiteName: req.app.set('sitename'),
                            ogImageUrl: 'http://' + req.app.set('domain') + '/public/images/logo.png',
                            ogDescription: ''
                        }
                    });
                });
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