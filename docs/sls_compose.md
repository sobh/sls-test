# 📄 Serverless Compose Guide

For a list of common commands, see the
**[Quick Reference Guide](./quick_reference.md)**.

## 📝 Overview

This project uses **Serverless Compose** to orchestrate multiple Serverless
services in a monorepo. Serverless Compose allows you to:

- Deploy multiple services with a single command
- Manage dependencies between services
- Share outputs between services
- Simplify multi-service workflows

## ⚙️ Configuration

The `serverless-compose.yaml` file at the root of the project defines all
services:

```yaml
services:
  books:
    path: src/services/books

  tests:
    path: src/services/tests
```

## 🔗 Service Dependencies

If one service depends on another, you can specify dependencies in
`serverless-compose.yaml`:

```yaml
services:
  books:
    path: src/services/books

  tests:
    path: src/services/tests
    dependsOn:
      - books
```

This ensures `books` is deployed before `tests`.

## 📤 Sharing Outputs Between Services

Services can share outputs using CloudFormation outputs and references.

### Example: Exporting from Books Service

In `src/services/books/service.yaml`:

```yaml
resources:
  Outputs:
    BooksTableName:
      Value: !Ref BooksTable
      Export:
        Name: ${self:service}-${sls:stage}-BooksTableName

    BooksTableArn:
      Value: !GetAtt BooksTable.Arn
      Export:
        Name: ${self:service}-${sls:stage}-BooksTableArn
```

### Example: Importing in Tests Service

In `src/services/tests/service.yaml`:

```yaml
provider:
  environment:
    BOOKS_TABLE_NAME: !ImportValue books-${sls:stage}-BooksTableName
```

## ✨ Advanced Usage

### ➡️ Passing Parameters

Pass parameters to specific services:

```yaml
services:
  books:
    path: src/services/books
    params:
      tableName: CustomBooksTable
```

Access in service's `service.yaml`:

```yaml
custom:
  tableName: ${param:tableName, 'BooksTable'}
```

### 🎯 Stage-Specific Configuration

Configure different settings per stage:

```yaml
services:
  books:
    path: src/services/books
    params:
      dev:
        memorySize: 512
      prod:
        memorySize: 1024
```

## ✅ Benefits of Serverless Compose

1. **Simplified Deployment** - Deploy all services with one command
2. **Dependency Management** - Automatic ordering of service deployments
3. **Output Sharing** - Easy sharing of resources between services
4. **Unified Configuration** - Single source of truth for all services
5. **Faster Iteration** - Deploy only changed services (future feature)

## 🌟 Best Practices

1. **Keep Services Independent** - Minimize dependencies between services
2. **Use Outputs for Sharing** - Share resources via CloudFormation outputs
3. **Version Control** - Commit `serverless-compose.yaml` to version control
4. **Stage Isolation** - Use different stages for dev/prod environments
5. **Service Naming** - Use clear, descriptive service names

## ⚠️ Troubleshooting

### ❓ Service Not Found

If you get "service not found" errors, ensure:

- The service path in `serverless-compose.yaml` is correct
- Each service has a valid `serverless.ts` and `service.yaml` file

### 🔄 Deployment Order Issues

If services fail due to missing dependencies:

- Add `dependsOn` to ensure proper deployment order
- Use CloudFormation exports/imports for resource sharing

### ✖️ Stage Mismatch

Always specify the same stage for all operations:

```bash
# Good
serverless deploy --stage dev
serverless info --stage dev

# Bad - mixing stages
serverless deploy --stage dev
serverless info --stage prod
```

## ⬆️ Migration from Individual Deployments

If you were previously deploying services individually:

1. **Before (Individual with cd)**:

   ```bash
   cd src/services/books && sls deploy --stage dev
   cd ../tests && sls deploy --stage dev
   ```

2. **After (Compose from root with --service flag)**:

   ```bash
   # Deploy all services
   sls deploy --stage dev
   # or
   npm run deploy:dev

   # Deploy individual services from root
   sls deploy --service books --stage dev
   sls deploy --service tests --stage dev
   ```

All commands now run from the root directory using the `--service` flag!

## 📚 Resources

- [Serverless Compose Documentation](https://www.serverless.com/framework/docs/guides/compose)
- [Service Dependencies](https://www.serverless.com/framework/docs/guides/compose#service-dependencies)
- [Sharing Outputs](https://www.serverless.com/framework/docs/guides/compose#sharing-cloudformation-outputs)

```
```
