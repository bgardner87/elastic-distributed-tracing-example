module.exports = {
    database: {
        client: process.env.DATABASE_CLIENT || 'pg',
        connection: {
            database: process.env.DATABASE_NAME || 'distributed_tracing_demo',
            host: process.env.DATABASE_HOST || 'elastic-apm-demo-postgres',
            port: process.env.DATABASE_PORT || '5432',
            user: process.env.DATABASE_USER || 'demouser',
            pass: process.env.DATABASE_PASS || 'demopass',
        }
    }
};
