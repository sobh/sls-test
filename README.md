# 📦 Serverless Basics - Monorepo

This is a Serverless Framework monorepo project demonstrating best practices for
organizing multiple microservices with shared libraries.

## 📥 Installation

To install the project dependencies, run:

```bash
npm install
```

## 📚 Documentation

For a deeper dive into the project's architecture, usage, and features, please
refer to the following documents:

- **[Monorepo Structure](./docs/monorepo.md)**: Detailed explanation of the
  project structure, services, and shared libraries.
- **[Quick Reference](./docs/quick_reference.md)**: A handy guide for common
  commands and service endpoints.
- **[Serverless Compose Guide](./docs/sls_compose.md)**: In-depth guide to using
  Serverless Compose for orchestration.
- **[OpenTelemetry Guide](./docs/opentelemetry.md)**: An explanation of the
  distributed tracing setup with OpenTelemetry and ADOT.
- **[Middy and Powertools Integration](./docs/middy-powertools-integration.md)**:
  How to integrate Middy with AWS Powertools Logger.
- **[Echo Handler Example](./docs/echo-handler-example.md)**: A practical
  example of a Lambda handler with JSON parsing.

## 🧩 Features

- ✅ **Serverless Compose** - Orchestrate multiple services
- ✅ **Independent Services** - Deploy services separately
- ✅ **Shared Libraries** - Reduce code duplication
- ✅ **TypeScript** - Full type safety
- ✅ **AWS Powertools** - Structured logging
- ✅ **OpenTelemetry** - Distributed tracing
- ✅ **Middy** - Lambda middleware
- ✅ **Zod** - Runtime validation
- ✅ **ESBuild** - Fast builds
