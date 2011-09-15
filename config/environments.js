/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 12:23 AM
 * To change this template use File | Settings | File Templates.
 */

module.exports = function(app){

  var port = process.env.PORT || 3000;

  app.configure('local', function (){
    this
      .set('version','1.0.0')
      .set('host', 'localhost')
      .set('port', port)
      .set('env','local')
  });

  app.configure('production', function (){
    this
      .set('version','1.0.0')
      .set('host', 'lameblog.herokuapp.com')
      .set('port', port)
      .set('env','local')
  });
}
