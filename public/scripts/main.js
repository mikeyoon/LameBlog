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
            $('#comment-link').click(function() {
                $.post('/comment/' + $(this).attr('post-id'), {
                    'comment[name]': user.name,
                    'comment[message]': $('#comment-message').val()
                }).success(function(response) {
                    $('<p><div>' + response.name + '</div><div>' + response.message +'</div><div>' + response.createDate + '</div></p>').appendTo('.comments');
                });
            });
        }
        else
        {
            $('.login').removeClass('hide');
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