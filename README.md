# Serverless Basics

This is a sample project for testing the Serverless framework.

## Installation

To install the project dependencies, run the following command:

```bash
npm install
```

## Deployment

To deploy the service, run the following command:

```bash
serverless deploy
```

## Architecture

This project follows a standard serverless architecture, using AWS Lambda and
DynamoDB. The API Gateway is used to expose the Lambda functions as a REST API.

The architecture is designed to be simple and scalable. Each handler has a
single responsibility, and the business logic is separated from the
infrastructure code.

## Project Structure

The project is structured as follows:

```text
.
├── app
│   ├── clients
│   │   └── creatDynamoDBClient.ts
│   ├── handlers
│   │   ├── books
│   │   │   ├── createBook.ts
│   │   │   ├── deleteBook.ts
│   │   │   ├── getBook.ts
│   │   │   ├── listBooks.ts
│   │   │   └── updateBook.ts
│   │   └── tests
│   │       ├── testError.ts
│   │       ├── testExternalCall.ts
│   │       └── testInternalCall.ts
│   ├── models
│   │   └── BookModel.ts
│   ├── repositories
│   │   └── BookRepository.ts
│   ├── schemas
│   │   └── BookSchemas.ts
│   └── services
│       └── logger.ts
├── serverless.yaml
├── package.json
└── tsconfig.json
```

- `app/clients`: Contains the DynamoDB client.
- `app/handlers`: Contains the Lambda handlers, organized by domain (e.g.,
  `books`, `tests`).
- `app/models`: Contains the business logic.
- `app/repositories`: Contains the database logic.
- `app/schemas`: Contains the Zod schemas for validation.
- `app/services`: Contains shared services like the logger.
- `serverless.yaml`: Contains the Serverless framework configuration.
- `package.json`: Contains the project dependencies.
- `tsconfig.json`: Contains the TypeScript configuration.
