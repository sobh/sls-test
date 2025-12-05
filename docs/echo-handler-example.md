# Testing the Echo Handler

## Overview

The `testEcho` handler demonstrates how to use Middy's `http-json-body-parser` middleware to automatically parse JSON request bodies.

## How It Works

1. **Request arrives** with a JSON body (as a string)
2. **Middy's JSON parser** automatically converts it to a JavaScript object
3. **Handler receives** the parsed object in `event.body`
4. **Handler adds** a `message` and `timestamp` field
5. **Response returns** the enhanced object

## Example Request

```bash
# Using curl
curl -X POST https://your-api.amazonaws.com/test/echo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 30,
    "city": "New York"
  }'
```

## Example Response

```json
{
	"name": "John Doe",
	"age": 30,
	"city": "New York",
	"message": "Echo response from Lambda",
	"timestamp": "2025-12-05T00:31:08.123Z"
}
```

## Testing Locally with Serverless Offline

If you have `serverless-offline` installed:

```bash
# Start the local server
npm run offline

# In another terminal, test the endpoint
curl -X POST http://localhost:3000/dev/test/echo \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "foo": "bar"}'
```

## Key Features

✅ **Automatic JSON Parsing** - No need to manually parse `event.body`
✅ **Type Safety** - Custom `EchoEvent` type ensures correct typing
✅ **Error Handling** - Middy's error handler catches any issues
✅ **Logging** - AWS Powertools Logger tracks requests and responses
✅ **Clean Code** - Middleware handles cross-cutting concerns

## Code Breakdown

```typescript
// Custom type for parsed body
interface EchoEvent extends Omit<APIGatewayProxyEvent, 'body'> {
	body: Record<string, any>;
}

// Handler receives parsed JSON
async function lambdaHandler(event: EchoEvent, context: Context) {
	// event.body is already a JavaScript object!
	const requestBody = event.body || {};

	// Add fields
	const responseBody = {
		...requestBody,
		message: 'Echo response from Lambda',
		timestamp: new Date().toISOString(),
	};

	return { statusCode: 200, body: JSON.stringify(responseBody) };
}

// Enable JSON parsing with parseJson: true
export const handler = middyfy(lambdaHandler, { parseJson: true });
```

## Important Notes

1. **Content-Type Header**: The client must send `Content-Type: application/json`
2. **Body Type**: After parsing, `event.body` is an object, not a string
3. **Error Handling**: Invalid JSON will be caught by Middy's error handler
4. **Response Format**: You still need to stringify the response body

## Extending the Pattern

You can combine multiple middleware options:

```typescript
export const handler = middyfy(lambdaHandler, {
	parseJson: true,
	fallbackMessage: 'Failed to process echo request',
});
```

## See Also

- [Middy JSON Body Parser](https://middy.js.org/docs/middlewares/http-json-body-parser)
- [AWS Lambda Event Types](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/aws-lambda/index.d.ts)
