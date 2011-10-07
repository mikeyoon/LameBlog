/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 10/5/11
 * Time: 6:29 PM
 * To change this template use File | Settings | File Templates.
 */

//Display a list of options
module.exports.index = function(req, res, next) {
    res.render('admin/index');
};

//List posts for editing
module.exports.getPosts = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.find({}, function(err, data) {
        res.render('admin/posts', { posts: data });
    });
};

//View a post for editing
module.exports.getPost = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.findById(req.params.id, function(err, data) {
        res.render('admin/editpost', {
            post: data,
            action: 'edit'
        });
    });
};

module.exports.newPost = function(req, res, next) {
    res.render('admin/addpost');
};

module.exports.addPost = function(req, res, next) {
    var Post = req.app.set('db').posts;

    var item = new Post();
    item.title = req.body.post.title;
    item.body = req.body.post.body;
    item.path = '/' + item.title.replace(/ /g, "_");
    item.tags = req.body.post.tags.split(',');

    item.save(function(err) {
        res.send({
            success: true,
            path: item.path
        });
    });
};

//Edit the post
module.exports.editPost = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.findById(req.params.id, function(err, data) {
        var edit = req.body.post;

        data.body = edit.body;
        data.title = edit.title;

        data.save(function(err) {
            res.send({
                success: true
            });
        });
    });
};

//Delete a post
module.exports.deletePost = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.findById(req.params.id, function(err, data) {

        data.remove(function(err) {
            res.send({
                success: true
            });
        });
    });
};

//Delete a comment in a post
module.exports.deleteComment = function(req, res, next) {
    
};