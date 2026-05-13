# Medical Appointment Microservices

## Description

This project is a Node.js microservices application for managing medical appointments.

The application is composed of:
- API Gateway
- Patient Service
- Doctor Service
- Appointment Service
- Notification Service
- Kafka Broker
- Separate SQLite databases for each main microservice

## Architecture

The client communicates with the API Gateway using REST and GraphQL.

The API Gateway communicates with the microservices using gRPC.

Kafka is used for asynchronous communication between services.

## Technologies

- Node.js
- Express.js
- gRPC
- Protocol Buffers
- GraphQL
- Kafka
- KafkaJS
- SQLite3
- Postman
- GitHub