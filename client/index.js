'use strict';

const Hapi = require('hapi');
const Path = require('path');

const init = async () => {

    const server = Hapi.server({
        port: 3003,
        host: '0.0.0.0'
    });

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return h.file('./client/public/index.html');
        }
    });

    server.route({
        method: 'GET',
        path:'/test',
        handler: (request, h) => {

            return 'hello';
        }
    });

    server.route({
        method: 'GET',
        path: '/elastic-apm-rum.umd.min.js',
        handler: (request, h) => {

            return h.file('./public/elastic-apm-rum.umd.min.js');
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