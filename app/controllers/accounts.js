/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 9:39 PM
 * To change this template use File | Settings | File Templates.
 */

module.exports.login = function(req, res, next) {
    var User = req.app.set('db').users;
    var login = req.body.login;

    User.findByEmailAndPassword(login.email, login.password, function(err, data) {
        req.session.user = data;
        res.redirect('/admin');
    });
};

module.exports.facebookLogin = function(req, res, next) {
    
};

module.exports.loginForm = function(req, res, next) {
    var User = req.app.set("db").users;

    User.findOne({ userType: "admin" }, function(err, data) {
        if (data) {
            console.log(data);
            res.render('admin/login');
        } else {
            res.render('admin/newadmin');
        }
    });
};

module.exports.setup = function(req, res, next) {
    var User = req.app.set("db").users;

    var input = req.body.user;
    var admin = new User({
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: User.getHash(input.password),
        userType: 'admin'
    });

    admin.save(function(err) {
        req.session.user = admin;
        res.redirect('/admin');
    });
};

module.exports.index = function(req, res, next) {
    res.render('admin/posts')
};