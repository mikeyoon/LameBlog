/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 10/5/11
 * Time: 6:29 PM
 * To change this template use File | Settings | File Templates.
 */

const Flow = require('nestableflow')
    , dateformat = require("dateformat")
    , zoneinfo = require('zoneinfo')
    , TZDate = zoneinfo.TZDate;

//Display a list of options
module.exports.index = function(req, res, next) {
    res.render('admin/index');
};

//List posts for editing
module.exports.getPosts = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.find({}, [], { sort: [ [ 'publishDate', 'descending' ] ] }, function(err, data) {
        res.render('admin/posts', { posts: data });
    });
};

//View a post for editing
module.exports.getPost = function(req, res, next) {
    var Post = req.app.set('db').posts;
    var Tag = req.app.set('db').tag;

    Post.findById(req.params.id, function(err, data) {
        Tag.find({}, function(err, tags) {
            var t = [ ];
            for(var ii = 0;ii < data.tags.length; ii++)
            {
                t.push({
                    name: data.tags[ii],
                    selected: true
                });
            }

            for (var ii = 0;ii < tags.length;ii++) {
                if (!t.some(function(p) { return p.name === tags[ii].name }))
                    t.push({
                        name: tags[ii].name,
                        selected: false
                    });
            }

            res.render('admin/editpost', {
                post: data,
                tags: t,
                action: 'edit'
            });
        });
    });
};

module.exports.newPost = function(req, res, next) {
    var Tag = req.app.set('db').tag;

    var ex = new TZDate(this.publishDate);
    ex.setTimezone('America/Los_Angeles');
    var date = dateformat(ex, 'mm-dd-yyyy hh:MM TT Z');

    Tag.find({}, function(err, data) {
        res.render('admin/addpost', { tags: data, currentDate: date });
    });
};

module.exports.addTag = function(req, res, next) {
    var Tag = req.app.set('db').tag;
    var name = req.params.name;

    Tag.findOne({ name: name }, function(err, data) {
        console.log(err);
        if (!data)
        {
            var newTag = new Tag({
                name: name,
                posts: []
            });

            newTag.save(function(err) {
                res.send({
                    success: true
                });
            });
        }
        else
        {
            res.send({
                success: false
            });
        }
    });
};

module.exports.addPost = function(req, res, next) {
    var Post = req.app.set('db').posts;
    var Tag = req.app.set('db').tag;

    var tags = req.body.post.tags;

    var item = new Post();
    item.title = req.body.post.title;
    item.body = req.body.post.body;
    item.path = '/' + item.title.replace(/ /g, "_").replace(/[^_0-9a-zA-Z]/g, "");
    item.tags = tags ? tags.filter(function(t) { return t; }) : [ ];
    item.publishDate = new Date(Date.parse(req.body.post.publishDate));
    item.hidden = req.body.post.hidden || false;

    Post.count({
        path: item.path
    }, function(e, existingCount) {
        if (existingCount > 0)
        {
            res.send({
                success: false,
                message: 'New post path conflicts with an existing post path, please change the title'
            });
        }
        else
        {
            item.save(function(err) {
                if (!err) {
                    Tag.addToAllTags(item.tags, item._id, function(err) {
                        console.log(err);
                        res.send({
                            success: true,
                            path: item.path
                        });
                    });
                }
                else
                {
                    console.log(err);
                    res.send({
                        success: false,
                        message: err.message
                    });
                }
            });
        }
    });
};

//Edit the post
module.exports.editPost = function(req, res, next) {
    var Post = req.app.set('db').posts;
    var Tag = req.app.set('db').tag;

    Post.findById(req.params.id, function(err, data) {
        var edit = req.body.post;

        Tag.removeFromAllTags(data._id, function(err) {
            data.body = edit.body;
            data.title = edit.title;
            data.tags = edit.tags ? edit.tags.filter(function(t) { return t; }) : [ ];
            data.hidden = edit.hidden || false;
            data.publishDate = new Date(Date.parse(edit.publishDate));

            data.save(function(err) {
                if (err)
                {
                    res.send({
                        success:false,
                        message: err.message
                    });
                }
                else
                {
                    Tag.addToAllTags(data.tags, data._id, function(tagErr) {
                        console.log(tagErr);
                        res.send({
                            success: true
                        });
                    });
                }
            });
        });
    });
};

//Delete a post
module.exports.deletePost = function(req, res, next) {
    var Post = req.app.set('db').posts;
    var Tag = req.app.set('db').tag;

    Post.findById(req.params.id, function(err, data) {
        Tag.removeFromAllTags(data._id, function(err2) {
            console.log(err2);
            data.remove(function(err3) {
                res.send({
                    success: true
                });
            });
        });
    });
};

//Delete a comment in a post
module.exports.deleteComment = function(req, res, next) {
    
};