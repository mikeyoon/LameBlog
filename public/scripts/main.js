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