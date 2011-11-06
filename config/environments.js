/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 12:23 AM
 * To change this template use File | Settings | File Templates.
 */

const express = require('express')
    , RedisStore = require('connect-redis')(express);


module.exports = function(app){

  var port = process.env.PORT || 3000;
  var params = app.set('params');

  app.configure('local', function (){
    this
      .set('version','1.0.0')
      .set('host', 'localhost')
      .set('domain', params.site_url)
      .set('port', port)
      .set('env','local')
      .use(express.session({ secret: 'secret key'}));
  });

  app.configure('production', function (){
    this
      .set('version','1.0.0')
      .set('host', params.site_url)
      .set('domain', params.site_url + (port != 80 ? ':' + port : ''))
      .set('port', port)
      .set('env','production')
      .use(express.session({ store: new RedisStore, secret: 'secret key'}));
  });
}
