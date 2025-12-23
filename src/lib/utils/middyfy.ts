// ---- Imports ----------------------------------------------------------------
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import inputOutputLogger from '@middy/input-output-logger';
import type { Handler } from 'aws-lambda';
import { logger } from './logger';
// ---- Types ------------------------------------------------------------------
type MiddyOptions = { fallbackMessage?: string; parseJson?: boolean };

// ---- Utility ----------------------------------------------------------------

/**
 * Wraps a Lambda handler with Middy middleware and AWS Powertools Logger
 * integration
 *
 * @param handler - The Lambda handler function to wrap
 * @param options - Optional configuration for the middleware
 * @param options.fallbackMessage - Custom error message for unhandled errors
 * @param options.parseJson - Whether to parse JSON request bodies (default:
 * false)
 * @returns A Middy-wrapped handler with error handling and logging
 */
export function middyfy<TEvent = any, TResult = any>(
	handler: Handler<TEvent, TResult>,
	options: MiddyOptions = {},
): middy.MiddyfiedHandler<TEvent, TResult> {
	const middleware = middy(handler);

	// Input Output Logger
	middleware.use(inputOutputLogger({
		logger: (request) => {
			const child = logger.createChild(request.context);
			let logData = request.event ?? request.response;
			if (typeof logData?.body === 'string') {
				try {
					logData = { ...logData, body: JSON.parse(logData.body) };
				} catch {
					// Ignore parse errors
				}
			}
			child.info(logData);
		},
		awsContext: true,
	}));

	// Add Lambda Context to the logger
	middleware.use(injectLambdaContext(logger));

	// JSON body parser
	if (options.parseJson) {
		middleware.use(httpJsonBodyParser());
	}

	// Always add error handler last
	middleware.use(httpErrorHandler({
		logger: (error) => {
			logger.error(`Error: ${error.message}`, error as Error);
		},
		fallbackMessage: options.fallbackMessage ?? 'Internal Server Error',
	}));

	// Response serializer (application/json)
	middleware.use(
		httpResponseSerializer({
			serializers: [{
				regex: /^application\/json$/,
				serializer: ({ body }) => JSON.stringify(body),
			}],
			defaultContentType: 'application/json',
		}),
	);

	return middleware;
}
