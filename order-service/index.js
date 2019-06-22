'use strict';

const Hapi = require('hapi');
const Elasticsearch = require('elasticsearch');
const config = require('../config');


const init = async () => {

    const server = Hapi.server({
        port: 3002,
        host: 'localhost'
    });

    const elasticClient = new Elasticsearch.Client({...config.elasticsearch});

    server.app.elasticClient = elasticClient;

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
        handler: async (request, h) => {
            console.log('Orders request received');
            const elasticClient = request.server.app.elasticClient;

            const queryResults = await elasticClient.search({
                index: 'orders',
                type: '_doc',
                body: {
                    query: {
                        match_all: {}
                    }
                }
            });
            
            return {data: queryResults.hits.hits};
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