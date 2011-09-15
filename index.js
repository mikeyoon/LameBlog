/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var app = require('./config/app')();
var port = process.env.PORT || 3000;

app.listen(port);

console.log("Started");
