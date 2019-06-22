'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const webRequest = require('request-promise-native');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {

            return 'hello';
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
                uri: 'http://localhost:3001/auth',
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
                uri: 'http://localhost:3002/orders',
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