/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/27/11
 * Time: 7:19 PM
 * To change this template use File | Settings | File Templates.
 */

var LB = {};

LB.init = function(fbAppId, next) {
    window.fbAsyncInit = function() {
        FB.init({
            appId:fbAppId,
            cookie:true,
            status:true,
            xfbml:true
        });

        if (next)
            next();
    };

    (function() {
        var e = document.createElement('script');
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        e.async = true;
        $('#fb-root').append(e);
    })();
};

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
                if (('#comment-message').val() == '')
                    return false;
                
                $.post('/comment/' + $(this).attr('post-id'), {
                    'comment[name]': user.name,
                    'comment[message]': $('#comment-message').val()
                }).success(function(response) {
                    $('#commentTemplate').tmpl(response).appendTo('.comments');
                    $('.add-comment').html('Thanks for your comment!');
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
            console.log(response);
            if (response.status == "connected") {
                if (next)
                    next();
            } else {
                console.log('User cancelled login');
            }
        });
    });
};