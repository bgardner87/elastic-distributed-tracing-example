'use strict';

const ElasticAPM = require('elastic-apm-node');

const apm = ElasticAPM.start({
    serviceName: 'demo-order',
  
    secretToken: 'CjnbD2bsszn2A4kZz2',
  
    serverUrl: 'https://dc663cdec89747d4873018cae96fb96f.apm.us-east-1.aws.cloud.es.io:443',
    captureBody: 'all',
    logLevel: 'info'
});

const Hapi = require('hapi');
const Elasticsearch = require('elasticsearch');
const config = require('./config');


const init = async () => {

    const server = Hapi.server({
        port: 3002,
        host: '0.0.0.0'
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