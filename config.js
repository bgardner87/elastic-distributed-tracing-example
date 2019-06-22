module.exports = {
    database: {
        client: process.env.DATABASE_CLIENT || 'pg',
        connection: {
            database: process.env.DATABASE_NAME || 'distributed_tracing_demo',
            host: process.env.DATABASE_HOST || 'localhost',
            port: process.env.DATABASE_PORT || '5432',
            user: process.env.DATABASE_USER || 'demouser',
            pass: process.env.DATABASE_PASS || 'demopass',
        }
    },
    elasticsearch: {
        host: [
            {
                host: process.env.ELASTIC_HOST || '8491fc0e4b124475bea611ca361620d0.us-east-1.aws.found.io',
                auth: process.env.ELASTIC_AUTHENTICATION || 'demo:DistributedTracing',
                protocol: process.env.ELASTIC_PROTOCOL || 'https',
                port: process.env.ELASTIC_PORT || 9243
            }
        ],
        log: 'error',
        requestTimeout: 60000
    },
};
