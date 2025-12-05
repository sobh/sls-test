# AWS X-Ray SDK ESM Compatibility

This project uses **ECMAScript Modules (ESM)** (`"type": "module"` in
`package.json`). However, the **AWS X-Ray SDK** (used by AWS Lambda Powertools
Tracer) is a **CommonJS** module that relies on the `require` function and other
Node.js globals like `__filename` and `__dirname`.

These globals are **not available** in ESM environments, which causes runtime
errors when the X-Ray SDK tries to use them.

## The Solution

To fix this, we configure **esbuild** (via `serverless.yaml`) to inject a
"banner" at the top of every bundled file. This banner manually creates the
missing globals using standard ESM APIs.

### Configuration in `serverless.yaml`

```yaml
build:
  esbuild:
    banner:
      js: 'import { createRequire } from "module"; import { fileURLToPath } from "url"; import { dirname } from "path"; const require = createRequire(import.meta.url); const __filename = fileURLToPath(import.meta.url); const __dirname = dirname(__filename);'
```

### How It Works

1. **`createRequire(import.meta.url)`**: Creates a `require` function that works
   within the current ESM module. This allows the X-Ray SDK (and other CJS
   dependencies) to use `require()` as they expect.
2. **`fileURLToPath(import.meta.url)`**: Recreates `__filename`.
3. **`dirname(__filename)`**: Recreates `__dirname`.

## Troubleshooting

If you encounter "ReferenceError: require is not defined" or similar errors:

1. Ensure the `build.esbuild.banner` section exists in `serverless.yaml`.
2. Verify that you are using Serverless Framework V4 (which uses esbuild by
   default).
3. If using `serverless-offline`, ensure it's picking up the build configuration
   (usually automatic).

## References

- [AWS Lambda Powertools Documentation - Tracer](https://docs.powertools.aws.dev/lambda/typescript/latest/core/tracer/)
- [Esbuild Documentation - Banner](https://esbuild.github.io/api/#banner)
