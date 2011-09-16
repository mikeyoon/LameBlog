/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/15/11
 * Time: 10:38 PM
 * To change this template use File | Settings | File Templates.
 */

module.exports.add = function(req, res, next) {

    if (req.form) {
        req.form.complete(function(err, fields, files) {
            console.log(files);
            res.send('form received');
        });
    }
    else
    {
        res.send('form received');
    }
};