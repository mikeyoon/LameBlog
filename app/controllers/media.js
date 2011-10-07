/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/15/11
 * Time: 10:38 PM
 * To change this template use File | Settings | File Templates.
 */

const knox = require('knox'),
    im = require('imagemagick');

var client = knox.createClient({
    key: process.env.S3_KEY
    , secret: process.env.S3_SECRET
    , bucket: 'lameblog'
});

module.exports.add = function(req, res, next) {

    if (req.form) {
        req.form.complete(function(err, fields, files) {
            var fi = files['files[]'];
            var Media = req.app.set('db').media;

            var uploadImage = function(thumb) {
                client.putFile(fi.path, '/' + fi.name, function(err, s3res) {
                    if (err)
                    {
                        console.log(err);
                        res.send({ error: err });
                    }
                    else
                    {
                        var item = new Media();
                        item.filename = fi.name;
                        item.filetype = 'text';
                        item.url = 'http://lameblog.s3.amazonaws.com/' + fi.name; //response url isn't filled in for some reason
                        item.thumburl = 'http://lameblog.s3.amazonaws.com/' + thumb;
                        item.thumbname = thumb;
                        item.size = fi.size;
                        item.save(function(err) {
                            res.send([{
                                name: fi.name,
                                size: fi.size,
                                url: item.url,
                                thumbnail_url: thumb ? item.thumburl : null,
                                delete_url: item._id,
                                delete_type: 'DELETE'
                            }]);
                        });
                    }
                });
            };

            if (fi.mime.indexOf('image') != -1)
            {
                im.resize({
                    srcPath: fi.path,
                    dstPath: fi.path + ".thumb",
                    width: 128,
                    height: 128
                }, function(err, stdout, stderr) {
                    if (err) throw err;
                    console.log('resized');

                    client.putFile(fi.path + ".thumb", '/thumb-' + fi.name, function(err, s3res) {
                        if (err)
                        {
                            console.log(err);
                            res.send({ error: err });
                        }
                        else
                        {
                            uploadImage('thumb-' + fi.name);
                        }
                    });
                });
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

            client.deleteFile('/' + data.filename, function(err, s3res) {
                if (data.thumbname)
                {
                    client.deleteFile('/' + data.thumbname, function(err, tres) {
                        res.send({ success: true });
                    });
                }
                else
                    res.send({ success: true });

            });
        };
    });
};

module.exports.index = function(req, res, next) {
    var Media = req.app.set('db').media;

    Media.find({}, function(err, data) {
        console.log(data);
        res.render('admin/upload', { files: data });
    });
};