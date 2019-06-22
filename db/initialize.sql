CREATE DATABASE distributed_tracing_demo;

CREATE USER demouser WITH PASSWORD 'demopass';
ALTER USER demouser WITH SUPERUSER;

GRANT ALL PRIVILEGES ON DATABASE distributed_tracing_demo to demouser;