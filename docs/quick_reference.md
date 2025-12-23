# ⚡ Quick Reference - Serverless Monorepo

For detailed information on project structure, architecture, and adding new
services, see the **[Monorepo Structure Guide](./monorepo.md)**.

## 💻 Common Commands

### 🚀 Serverless Compose (Recommended)

Manage all services together using Serverless Compose:

```bash
# Deploy all services
npm run deploy:dev              # Deploy to dev
npm run deploy:prod             # Deploy to prod

# Get information
npm run info:dev                # Info about all services (dev)
npm run info:prod             # Info about all services (prod)

# View logs
npm run logs:books              # View books service logs
npm run logs:tests              # View tests service logs

# Remove all services
npm run remove:dev              # Remove from dev
npm run remove:prod             # Remove from prod
```

### ⚙️ Individual Services

Deploy or manage a specific service from the root directory:

```bash
# Deploy individual services
npm run deploy:books:dev        # Books only (dev)
npm run deploy:tests:dev        # Tests only (dev)

# Or use Serverless Compose directly with --service flag
sls deploy --service books --stage dev
sls deploy --service tests --stage dev

# Remove individual services
npm run remove:books:dev        # Books only
npm run remove:tests:dev        # Tests only

# Or directly
sls remove --service books --stage dev
sls remove --service tests --stage dev
```

### 🧹 Code Formatting

```bash
npm run fmt                     # Format all files
npm run fmt:check               # Check formatting
```

## 🌐 Service Endpoints

### 📚 Books Service

- `GET /books` - List all books
- `POST /books` - Create a book
- `GET /books/{bookId}` - Get a book
- `PUT /books/{bookId}` - Update a book
- `DELETE /books/{bookId}` - Delete a book

### 🧪 Tests Service

- `POST /tests/echo` - Echo test
- `GET /tests/calls/external` - External call test
- `GET /tests/calls/internal/{id}` - Internal call test
- `GET /tests/calls/internal/traced/{id}` - Traced internal call test
- `GET /tests/error` - Error handling test

## ⁉️ Troubleshooting

### ❌ Import errors

- Ensure imports from shared libraries use: `../../../lib/...`
- Service-specific imports use relative paths

### 🛠️ Deployment issues

- Make sure you're in the correct directory
- Check `serverless.yaml` configuration
- Verify AWS credentials are configured

### 🚨 Build errors

- Run `npm install` to ensure dependencies are installed
- Check TypeScript compilation: `npx tsc --noEmit`
