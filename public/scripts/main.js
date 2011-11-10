/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/27/11
 * Time: 7:19 PM
 * To change this template use File | Settings | File Templates.
 */

var LB = {};

LB.setupCommenting = function(next) {
    FB.api('/me', function(user) {
        console.log(user);
        
        if (user != null && !user.error)
        {
            $('.login').removeClass('hide').addClass('hide');
            $('.add-comment').removeClass('hide');
            $('#comment-user').html(user.name);

            $('#fb-logout').click(function() {
                FB.logout(function(response) {
                    LB.setupCommenting();
                });
            });

            $('#comment-link').click(function() {
                if ($('#comment-message').val() == '')
                    return false;

                var message = $('#comment-message').val();

                $.post('/comment/' + $(this).attr('post-id'), {
                    'comment[name]': user.name,
                    'comment[message]': message
                }).success(function(response) {
                    FB.getLoginStatus(function(loginResponse) {
                        $.post('https://graph.facebook.com/me/lameblog:comment', {
                            access_token: loginResponse.session.access_token,
                            article: window.location.href,
                            message: message.length > 50 ? message.substring(0, 50) + '...' : message
                        });
                    });

                    $('#commentTemplate').tmpl(response).appendTo('.comments');
                    $('.add-comment').html('<div class="alert-message success">Thanks for your comment!</div>');
                });
            });
        }
        else
        {
            $('.login').removeClass('hide');
            $('.add-comment').removeClass('hide').addClass('hide');
            LB.login(LB.setupCommenting);
            return;
        }
        
        if (next)
            next();
    });
};

LB.login = function(next) {
    $('#login-button').click(function() {
        FB.login(function(response) {
            if (response.status == "connected") {
                if (next)
                    next();
            } else {
                console.log('User cancelled login');
            }
        });
    });
};

function updateQueryStringParameter(a, k, v) {
    var re = new RegExp("([?|&])" + k + "=.*?(&|$)", "i"),
    separator = a.indexOf('?') !== -1 ? "&" : "?";
    if (a.match(re))
        return a.replace(re, '$1' + k + "=" + v + '$2');
    else
        return a + separator + k + "=" + v;
};

(function($){$.ga={};$.ga.load=function(uid,callback){jQuery.ajax({type:'GET',url:(document.location.protocol=="https:"?"https://ssl":"http://www")+'.google-analytics.com/ga.js',cache:true,success:function(){if(typeof _gat==undefined){throw"_gat has not been defined";}t=_gat._getTracker(uid);bind();if($.isFunction(callback)){callback(t)}t._trackPageview()},dataType:'script',data:null})};var t;var bind=function(){if(noT()){throw"pageTracker has not been defined";}for(var $1 in t){if($1.charAt(0)!='_')continue;$.ga[$1.substr(1)]=t[$1]}};var noT=function(){return t==undefined}})(jQuery);