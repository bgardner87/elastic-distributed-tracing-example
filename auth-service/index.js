'use strict';

const ElasticAPM = require('elastic-apm-node');
const util = require('util');

const apm = ElasticAPM.start({
    serviceName: 'demo-auth',
  
    secretToken: 'CjnbD2bsszn2A4kZz2',
  
    serverUrl: 'https://dc663cdec89747d4873018cae96fb96f.apm.us-east-1.aws.cloud.es.io:443',
    captureBody: 'all',
    logLevel: 'info',
    asyncHooks: false // this is for knex due to open issue with instrumenting knex and async hooks.
    // logger: {
    //     trace: (message, ...params) => console.log(util.format(message, JSON.stringify(params))),
    //     debug: (message, ...params) => console.log(util.format(message, JSON.stringify(params))),
    //     info: (message, ...params) => console.log(util.format(message, JSON.stringify(params))),
    //     warn: (message, ...params) => console.log(util.format(message, JSON.stringify(params))),
    //     error: (message, ...params) => console.log(util.format(message, JSON.stringify(params))),
    //     fatal: (message, ...params) => console.log(util.format(message, JSON.stringify(params)))
    // }
});

const Hapi = require('hapi');
const Boom = require('boom');
const Knex = require('knex');
const knexConfig = require('./db/knexfile');

const init = async () => {

    const server = Hapi.server({
        port: 3001,
        host: '0.0.0.0'
    });

    const knex = Knex(knexConfig);
    server.app.knex = knex;

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {

            return 'hello';
        }
    });

    server.route({
        method: 'GET',
        path:'/auth',
        handler: async (request, h) => {
            console.log('Auth request received');
            const knex = request.server.app.knex;
            const credentials = request.headers.authorization;
            console.log(`Received Credentials: ${credentials}`);

            if (!credentials) {
                console.log('No credentials specified');
                return Boom.badRequest('No credentials specified');
            }

            const credentialSplit = credentials.split(':');
            const username = credentialSplit[0];
            const password = credentialSplit[1];

            const result = await knex('users').where('username', username);
            
            if (result.length === 0) {
                return Boom.notFound('User not found');
            }

            console.log('user is authorized');
            return {authorized: result[0].password === password};
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();