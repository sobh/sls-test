// ---- Imports ----------------------------------------------------------------
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import type { Handler } from 'aws-lambda';
import { logger } from '../services/logger';
import { tracer } from '../services/tracer';

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

	// Add Tracing
	middleware.use(captureLambdaHandler(tracer));

	// Add Lambda Context to the logger
	middleware.use(injectLambdaContext(logger));

	// Add JSON body parser
	if (options.parseJson) {
		middleware.use(httpJsonBodyParser());
	}

	// Add response serializer (application/json)
	middleware.use(
		httpResponseSerializer({
			serializers: [{
				regex: /^application\/json$/,
				serializer: ({ body }) => JSON.stringify(body),
			}],
			defaultContentType: 'application/json',
		}),
	);

	// Always add error handler last
	middleware.use(httpErrorHandler({
		logger: (error) => {
			logger.error('Unhandled error caught by middleware', error as Error);
		},
		fallbackMessage: options.fallbackMessage ?? 'Internal Server Error',
	}));

	return middleware;
}
