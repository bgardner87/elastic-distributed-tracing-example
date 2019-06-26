# Elastic Distributed Tracing Demo

## Overview
 This is a demo repository to test distributed tracing with Elastic APM. It consists of the following components:
 1. client - A small HTML/JS app that loads a list of orders to be viewed in a table.
 2. gateway - The microservice api gateway that will route requests to back end services.
 3. auth-service - A service backed by a postgres database to authenticate users.
 4. order-service - A service backed by data in elasticsearch to query a list of orders.

 *NOTE* You will need to have your own Elasticsearch and APM configuration set up, this demo was created using Elastic Cloud. Future goal is to dockerize the entire thing.

## Getting Started
1. Clone the repo
1. docker-compose up --build
1. Navigate to the client app at http://localhost:3003

## Ports Reference
App | Port 
--- | --- 
gateway | 3000 
auth-service | 3001 
order-service | 3002
client | 3003
