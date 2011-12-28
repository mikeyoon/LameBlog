/**
 * Created by JetBrains WebStorm.
 * User: mike
 * Date: 9/14/11
 * Time: 12:25 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Load dependencies
 */

    const express = require('express')
    , models = require('./models')
    , config = require('./config')
    , routes = require('./routes')
    , environments = require('./environments');
//, errors        = require('./errors');

/**
 * Exports
 */

module.exports = function () {

    //  Create Server

    const app = express.createServer()

    //  Load Expressjs config

    config(app);

    //  Load Environmental Settings

    environments(app);

    //  Load Mongoose Models

    models(app)

    //  Load routes config

    routes(app);

    //  Load error routes + pages

    //errors(app);

    return app;

};