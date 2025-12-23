# 📦 Serverless Monorepo Structure

This project is organized as a Serverless monorepo with multiple independent
services sharing common libraries.

## 📁 Directory Structure

```
sls-basics/
├── src/
│   ├── services/          # Independent microservices
│   │   ├── books/         # Books service
│   │   │   ├── handlers/  # Lambda handlers
│   │   │   ├── models/    # Business logic
│   │   │   ├── repositories/ # Data access layer
│   │   │   ├── schemas/   # Validation schemas
│   │   │   └── serverless.ts
│   │   └── tests/         # Tests service
│   │       ├── handlers/  # Lambda handlers
│   │       └── serverless.ts
│   └── lib/               # Shared libraries
│       ├── clients/       # HTTP and AWS clients
│       ├── errors/        # Custom error classes
│       └── utils/         # Utilities (logger, middleware, etc.)
├── sls.d   # Common Serverless configuration
│    ├── common.yaml       # Shared Services Configuration
│    └── serverless.yaml   # Serverless Configuration Aggregator
├── package.json
└── tsconfig.json
```

## ⚙️ Service Configuration

Each service's configured a `serverless.ts` file.This file is acts as a
configuration aggregator that, dynamically merges the service-specific settings
from a local `service.yaml` with a shared base configuration from
`sls.d/common.yaml`.

This approach ensures all services share common settings like provider details,
logging, and tracing, while allowing for service-specific customization.

## 🚀 Services

### 📚 Books Service (`src/services/books`)

Manages book-related operations with full CRUD functionality:

- `listBooks` - List all books
- `createBook` - Create a new book
- `getBook` - Get a book by ID
- `updateBook` - Update a book
- `deleteBook` - Delete a book

**Resources:**

- DynamoDB table for books storage

### 🧪 Tests Service (`src/services/tests`)

Provides test endpoints for debugging and monitoring:

- `testEcho` - Echo test
- `testExternalCall` - Test external API calls
- `testInternalCall` - Test internal service calls
- `testInternalTracedCall` - Test traced internal calls
- `testError` - Test error handling

## 🛠️ Working with Services

### 💻 Running Services Locally

Run a specific service:

```bash
npm run start:books   # Start books service
npm run start:tests   # Start tests service
```

### ☁️ Deploying Services

Deploy individual services:

```bash
npm run deploy:books:dev    # Deploy books to dev
npm run deploy:books:prod   # Deploy books to prod
npm run deploy:tests:dev    # Deploy tests to dev
npm run deploy:tests:prod   # Deploy tests to prod
```

Deploy all services:

```bash
npm run deploy:dev    # Deploy all services to dev
npm run deploy:prod   # Deploy all services to prod
```

### 🗑️ Removing Services

Remove individual services:

```bash
npm run remove:books:dev    # Remove books from dev
npm run remove:tests:dev    # Remove tests from dev
```

Remove all services:

```bash
npm run remove:dev    # Remove all services from dev
npm run remove:prod   # Remove all services from prod
```

## 📚 Shared Libraries

The `src/lib` directory contains shared code used across all services:

- **clients/** - HTTP client and AWS SDK clients
- **errors/** - Custom error classes for consistent error handling
- **utils/** - Common utilities:
  - `logger.ts` - AWS Powertools logger configuration
  - `middyfy.ts` - Middy middleware wrapper
  - `otel.ts` - OpenTelemetry utilities

## ✨ Benefits of This Structure

1. **Independent Deployment** - Each service can be deployed independently
2. **Code Reuse** - Shared libraries reduce duplication
3. **Clear Boundaries** - Each service has its own configuration and resources
4. **Scalability** - Easy to add new services
5. **Maintainability** - Clear separation of concerns

## ➕ Adding a New Service

1. Create a new directory under `src/services/`
2. Create `serverless.ts` which will merge `service.yaml` and `common.yaml`
3. Create a `service.yaml` configuration
4. Create a `handlers/` directory for Lambda functions
5. Add service-specific scripts to `package.json`
6. Import shared libraries from `src/lib/`

Example:

```bash
mkdir -p src/services/my-service/handlers
# Create serverless.ts, service.yaml and handlers
# Add scripts to package.json
```
