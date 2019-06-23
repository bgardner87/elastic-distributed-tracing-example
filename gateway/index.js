'use strict';

const ElasticAPM = require('elastic-apm-node');

const apm = ElasticAPM.start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'demo-gateway',
  
    // Use if APM Server requires a token
    secretToken: 'CjnbD2bsszn2A4kZz2',
  
    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'https://dc663cdec89747d4873018cae96fb96f.apm.us-east-1.aws.cloud.es.io:443',
    captureBody: 'all',
    logLevel: 'info'
});

const Hapi = require('hapi');
const Boom = require('boom');
const webRequest = require('request-promise-native');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {

            return 'hello';
        }
    });

    server.route({
        method: 'OPTIONS',
        path: '/{p*}',
        handler: (req, h) => {
            const response = h.response('success');

            const origin = req.headers.origin;
            response.header('Access-Control-Allow-Origin', origin);

            response.type('text/plain');
            response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, elastic-apm-traceparent');
            return response;
        },
        options: {
            auth: false,
            cors: false
        }
    });

    server.route({
        method: 'GET',
        path:'/orders',
        options: {
            cors: true
        },
        handler: async (request, h) => {
            console.log('Orders request received');

            const authHttpOptions = {
                uri: 'http://elastic-apm-demo-auth-service:3001/auth',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': request.headers.authorization
                },
                json: true
            };

            try {
                console.log('Checking if user is authorized.');
                const authResult = await webRequest(authHttpOptions);

                if (!authResult.authorized) {
                    console.log('Unauthorized');
                    return Boom.unauthorized('User unauthorized');
                }

                console.log('User is authorized.');
            } catch (err) {
                console.log(err.message);
                return Boom.unauthorized('User unauthorized');
            }
            
            const ordersHttpOptions = {
                uri: 'http://elastic-apm-demo-order-service:3002/orders',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                json: true
            };

            console.log('Getting orders from orders service');

            const ordersResult = await webRequest(ordersHttpOptions);

            console.log(`found ${ordersResult.data.length} orders`);

            return ordersResult.data;
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