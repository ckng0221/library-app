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
npm run start -- book
npm run start:dev -- book
npm run start:prod -- book
npm run build -- book
```