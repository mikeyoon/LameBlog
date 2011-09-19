/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 9:35 PM
 * To change this template use File | Settings | File Templates.
 */

module.exports.index = function(req, res, next) {
    var Post = req.app.set('db').posts;
    Post.find(function(err, data) {
        console.log(data);
        res.render('admin/posts');
    });
};

module.exports.add = function(req, res, next) {
    var Post = req.app.set('db').posts;

    var item = new Post();
    item.title = 'Title';
    item.body = req.body.post.body;
    item.path = '/' + item.title;
    item.save(function(err) {
        res.send({
            success: true,
            path: item.path
        });
    });
};

module.exports.delete = function(req, res, next) {
    var Post = req.app.set('db').posts;
};

module.exports.edit = function(req, res, next) {
    var Post = req.app.set('db').posts;

    Post.findById(req.params.id, function(err, data) {
        console.log(data);
    });
};

module.exports.view = function(req, res, next) {
    var Post = req.app.set('db').posts;
    console.log(req.params.id);
    Post.findByPath(req.params.id, function(err, data) {
        console.log(data);
        res.render('post/view', {
            title: data.title,
            body: data.htmlbody
        });
    });
};