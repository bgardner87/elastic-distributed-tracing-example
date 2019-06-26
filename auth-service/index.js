'use strict';

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