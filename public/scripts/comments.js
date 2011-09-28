/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/27/11
 * Time: 7:19 PM
 * To change this template use File | Settings | File Templates.
 */

var LB = {};

LB.init = function(fbAppId) {
    FB.init({
        appId:fbAppId, cookie:true,
        status:true, xfbml:true
    });
};

LB.setupCommenting = function() {
    FB.api('/me', function(user) {
        if (user != null)
        {
            $('.fb-action').html('<input type="button" value="Add Comment" />');
        }
        else
        {
            $('.fb-action').html('<fb:login-button>Login with Facebook</fb:login-button>');
        }
    });
};

//49fd55df6bca48c721de88c2ee452419