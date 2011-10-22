/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/15/11
 * Time: 10:38 PM
 * To change this template use File | Settings | File Templates.
 */

const knox = require('knox'),
    im = require('imagemagick'),
    flow = require('flow'),
    PAGE_SIZE = 4,
    BUCKET = 'lameblog1';

const BUCKET_PATH = '/images/';

var client = knox.createClient({
    key: process.env.S3_KEY
    , secret: process.env.S3_SECRET
    , bucket: BUCKET
});

module.exports.add = function(req, res, next) {

    if (req.form) {
        req.form.complete(function(err, fields, files) {
            var fi = files['files[]'];
            var Media = req.app.set('db').media;

            var ename = fi.name.replace(/ /g, '_');
            var thumb = 'thumb-' + ename;
            var inline = 'inline-' + ename

            if (fi.mime.indexOf('image') != -1)
            {
                flow.exec(
                    function() {
                        im.resize({
                            srcPath: fi.path,
                            dstPath: fi.path + ".inline",
                            width: 400
                        }, this);
                    }, function(err, stdout, stderr) {
                        im.resize({
                            srcPath: fi.path,
                            dstPath: fi.path + ".thumb",
                            width: 128
                        }, this);
                    }, function(err, stdout, stderr) {
                        client.putFile(fi.path + ".thumb", BUCKET_PATH + thumb, this);
                    }, function(err, s3res) {
                        if (err) {
                            console.log(err);
                            res.send({ error: err });
                        }
                        else {
                            client.putFile(fi.path + '.inline', BUCKET_PATH + inline, this);
                        }
                    }, function(err, s3res) {
                        if (err) {
                            console.log(err);
                            res.send({ error: err });
                        }
                        else {
                            client.putFile(fi.path, BUCKET_PATH + ename, this);
                        }
                    }, function(err, s3res) {
                        if (err) {
                            console.log(err);
                            res.send({ error: err });
                        } else {
                            var item = new Media();
                            item.filename = ename;
                            item.filetype = 'text';
                            item.url = 'http://' + BUCKET + '.s3.amazonaws.com' + BUCKET_PATH + ename;
                            item.thumburl = 'http://' + BUCKET + '.s3.amazonaws.com' + BUCKET_PATH + thumb;
                            item.inlineurl = 'http://' + BUCKET + '.s3.amazonaws.com' + BUCKET_PATH + inline;
                            item.thumbname = thumb;
                            item.inlinename = inline;
                            item.size = fi.size;
                            item.save(function(err) {

                                res.send([{
                                    name: ename,
                                    size: fi.size,
                                    url: item.url,
                                    thumbnail_url: thumb ? item.thumburl : null,
                                    delete_url: item._id,
                                    delete_type: 'DELETE'
                                }]);
                            });
                        }
                    }
                );
            }
        });
    }
    else
    {
        res.send('form received');
    }
};

module.exports.delete = function(req, res, next) {
    var Media = req.app.set('db').media;

    Media.findById(req.params.id, function(err, data) {
        if (data) {
            data.remove();

            flow.exec(
                function() { //Delete full size file
                    client.deleteFile(BUCKET_PATH + data.filename, this);
                }, function(err, s3res) { //Delete thumbnail
                    if (data.thumbname)
                    {
                        client.deleteFile(BUCKET_PATH + data.thumbname, this);
                    }
                    else
                        res.send({ success: true });
                }, function(err, s3res) { //Delete inline file
                    if (data.inlinename) {
                        client.deleteFile(BUCKET_PATH + data.inlinename, this);
                    } else
                        res.send({ success: true });
                }, function(err, s3res) { //Finish
                    res.send({ success: true });
                }
            );
        };
    });
};

module.exports.getImagesAsJson = function(req, res, next) {
    var Media = req.app.set('db').media;

    var page = req.params.page;

    console.log(page);

    Media.find({}, [], { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE }, function(err, data) {
        res.send({
            images: data
        });
    });
};

module.exports.picker = function(req, res, next) {
    var Media = req.app.set('db').media;

    Media.count({}, function(err, count) {
        var pages = [ ];

        for (var ii = 0;ii<Math.ceil(count / PAGE_SIZE);ii++)
        {
            pages.push(ii + 1);
        }

        Media.find({}, [], { limit: PAGE_SIZE }, function(err, data) {
            res.render('admin/imagepicker', {
                layout: false,
                pages: pages.splice(1),
                images: data
            });
        });
    });
};

module.exports.index = function(req, res, next) {
    var Media = req.app.set('db').media;

    Media.find({}, function(err, data) {
        res.render('admin/upload', { files: data });
    });
};