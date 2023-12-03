[![CI](https://github.com/ckng0221/library-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/ci.yml)
[![Book-CI](https://github.com/ckng0221/library-app/actions/workflows/book-ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/book-ci.yml)
[![Customer-CI](https://github.com/ckng0221/library-app/actions/workflows/customer-ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/customer-ci.yml)
[![Borrowing-CI](https://github.com/ckng0221/library-app/actions/workflows/borrowing-ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/borrowing-ci.yml)
[![Payment-CI](https://github.com/ckng0221/library-app/actions/workflows/payment-ci.yml/badge.svg)](https://github.com/ckng0221/library-app/actions/workflows/payment-ci.yml)

# Library App

A library app microservice in a monorepo setup, created using [NestJS](https://nestjs.com/).

There are several main services, including:

- book
- borrowing
- customer
- payment

To run each of the services, could run using by:

```bash
# Use nest cli directly
# Eg. next start <service_name>
nest start book

# Use npm scripts
# Eg. npm run <script> --  <service_name>
npm run start book
npm run start:dev book
npm run build book
```

The microservice requires MongoDB and RabbitMQ.
Could run on docker images for these services, if do not have them installed.
To run all the services in docker, could run:

```bash
# At project root
docker-compose up -d
```
