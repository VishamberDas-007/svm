# SVM Backend System

A backend repository of Valuenaire system.

## Quick start

1. yarn install
2. yarn sequelize db:create --env local
3. yarn dev

## linting

yarn lint

yarn lint:fix

## start prisma studio in browser

yarn prisma studio

## DB commands

### to reflect model chenges into schema.prisma

yarn prismix

### to create a new migration

yarn migrate

### for migrate database

yarn migrate:deploy

### for generate prisma client

yarn prisma generate
