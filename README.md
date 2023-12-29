# Library App

[![CI](https://github.com/ckng0221/library-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/ci.yml)
[![Book-CI](https://github.com/ckng0221/library-app/actions/workflows/book-ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/book-ci.yml)
[![Customer-CI](https://github.com/ckng0221/library-app/actions/workflows/customer-ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/customer-ci.yml)
[![Borrowing-CI](https://github.com/ckng0221/library-app/actions/workflows/borrowing-ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/borrowing-ci.yml)
[![Payment-CI](https://github.com/ckng0221/library-app/actions/workflows/payment-ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/payment-ci.yml)
[![UI-CI](https://github.com/ckng0221/library-app/actions/workflows/ui-ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/ui-ci.yml)

## Description

A prove-of-concept (POC) library application designed in a [microservice](https://microservices.io/) architecture. The application is built with [Typescript](https://www.typescriptlang.org/) in a [monorepo](https://monorepo.tools/) project setup.

The microservice app consists of the following services:

- book
- borrowing
- customer
- payment
- view

## Tech stacks

Backend:

- Server Framework: [NestJS](https://nestjs.com/)
- Database: [MongoDB](https://www.mongodb.com/)
- Message broker: [RabbitMQ](https://www.rabbitmq.com/)

Frontend:

- Framework: [React](https://react.dev/)
- Bundler: [Vite](https://vitejs.dev/)
- UI library: [Material UI](https://mui.com/)

Build:

- CI platform: [GitHub Actions](https://react.dev/)
- Build system: [Turborepo](https://turbo.build/)
- Multi-container tool: [Docker compose](https://docs.docker.com/compose/)

## Getting started

To run the application locally, it would require RabbitMQ and MongoDB to be installed on the client's machine.
Alternatively, you could [run all the services in docker](#run-with-docker-and-docker-compose) without install RabbitMQ and MongoDB locally.

### Run without docker

To test/build/run individual service:

```bash
# Eg. npm run <script> --  <service_name>
npm run test book # unit test
npm run test:e2e book # end-to-end test
npm run build book # build
npm run start:dev book # dev mode
npm run start book # prod mode
```

To test/build/run all services all at once:

```bash
npm run test # ran all unit tests
npm run test:e2e # ran all end-to-end tests
npm run build:all # build all
npm run start:dev:all # start all services in dev mode
npm run start:all # start all services in production mode
```

To run UI for React in dev mode only:

```bash
npm run dev:ui
```

### Run with Docker and Docker Compose

```bash
# At project root
npm run start:dev:docker # run via npm scripts
# Run directly via docker compose
docker compose up -d # start all containers in detached mode
docker compose up -d --build # forced build all containers
docker compose down # shut down all containers
```

## Contribution

For contribution, please refer the [contribution guide](CONTRIBUTING.md).
