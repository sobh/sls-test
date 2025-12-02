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
│   │   ├── createBook.ts
│   │   ├── deleteBook.ts
│   │   ├── getBook.ts
│   │   ├── listBooks.ts
│   │   └── updateBook.ts
│   ├── models
│   │   └── BookModel.ts
│   ├── repositories
│   │   └── BookRepository.ts
│   └── schemas
│       └── BookSchemas.ts
├── serverless.yaml
├── package.json
└── tsconfig.json
```

- `app/clients`: Contains the DynamoDB client.
- `app/handlers`: Contains the Lambda handlers.
- `app/models`: Contains the business logic.
- `app/repositories`: Contains the database logic.
- `app/schemas`: Contains the Zod schemas for validation.
- `serverless.yaml`: Contains the Serverless framework configuration.
- `package.json`: Contains the project dependencies.
- `tsconfig.json`: Contains the TypeScript configuration.
