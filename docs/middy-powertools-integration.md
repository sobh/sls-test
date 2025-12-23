# Integrating Middy with AWS Powertools Logger

This guide explains how to use Middy's error handler with AWS Powertools Logger
in your Serverless application.

## The Problem

Middy's `httpErrorHandler` expects a logger function with this signature:

```typescript
(error: Error) => void
```

However, AWS Powertools Logger's `error` method has a different signature:

```typescript
error(message: string, error?: Error): void
```

This means you can't directly pass `logger.error` to Middy.

## Solution 1: Inline Wrapper (Simple)

For individual handlers, wrap the logger inline:

```typescript
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { logger } from '../../services/logger';

export const handler = middy(lambdaHandler).use(
	httpErrorHandler({
		logger: (error) => {
			logger.error(
				'Unhandled error caught by middleware',
				error as Error,
			);
		},
		fallbackMessage: 'Internal Server Error',
	}),
);
```

**Pros:**

- Simple and explicit
- No additional files needed
- Easy to customize per handler

**Cons:**

- Repetitive if used across many handlers
- Harder to maintain consistency

## Solution 2: Reusable Utility (Recommended)

For multiple handlers, use the `middyfy` utility:

```typescript
import { logger } from '../../services/logger';
import { middyfy } from '../../utils/middyfy';

async function lambdaHandler(event, context) {
	logger.info('Processing request');
	// Your handler logic
}

export const handler = middyfy(lambdaHandler, {
	fallbackMessage: 'Internal Server Error',
});
```

**Pros:**

- DRY (Don't Repeat Yourself)
- Consistent error handling across all handlers
- Easy to extend with additional middleware
- Centralized configuration

**Cons:**

- Less flexibility for handler-specific customization
- Additional abstraction layer

## How It Works

The `middyfy` utility:

1. **Wraps your handler** with Middy middleware
2. **Integrates AWS Powertools Logger** by providing a compatible wrapper
   function
3. **Handles errors** automatically and logs them with proper context
4. **Returns formatted error responses** to API Gateway

## Extending the Utility

You can easily add more middleware to the `middyfy` utility:

```typescript
import httpJsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';

export function middyfy<TEvent = any, TResult = any>(
	handler: Handler<TEvent, TResult>,
	options: MiddyOptions = {},
): middy.MiddyfiedHandler<TEvent, TResult> {
	return middy(handler).use(httpJsonBodyParser()) // Parse JSON bodies
		.use(validator({ eventSchema: options.schema })) // Validate input
		.use(httpErrorHandler({
			logger: (error) => {
				logger.error(
					'Unhandled error caught by middleware',
					error as Error,
				);
			},
			fallbackMessage: options.fallbackMessage ?? 'Internal Server Error',
		}));
}
```

## Error Logging Format

When an error occurs, AWS Powertools Logger will log it with:

- **Message**: "Unhandled error caught by middleware"
- **Error object**: Full error details including stack trace
- **Timestamp**: Automatic ISO 8601 timestamp
- **Log level**: ERROR
- **Service name**: From your logger configuration

Example log output:

```json
{
	"level": "ERROR",
	"message": "Unhandled error caught by middleware",
	"error": {
		"name": "Error",
		"message": "Unhandled Error",
		"stack": "Error: Unhandled Error\n    at lambdaHandler..."
	},
	"timestamp": "2025-12-05T00:15:16.123Z",
	"service": "your-service-name"
}
```

## Best Practices

1. **Use `middyfy` for consistency** across your application
2. **Customize fallback messages** per handler based on the API endpoint
3. **Add correlation IDs** to track errors across distributed systems
4. **Monitor logs** in CloudWatch for error patterns
5. **Set up alerts** for critical errors

## See Also

- [Middy Documentation](https://middy.js.org/)
- [AWS Powertools Logger](https://docs.powertools.aws.dev/lambda/typescript/latest/core/logger/)
- [Error Handling Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-exceptions.html)
