// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { logger } from '../../../lib/utils/logger';
import { middyfy } from '../../../lib/utils/middyfy';

// ---- Handler ----------------------------------------------------------------

/**
 * Test Error Handler
 *
 * Throws an error to test error handling.
 *
 * @param event - The API Gateway event
 * @param context - The Lambda context
 * @returns The API Gateway response
 */
async function lambdaHandler(
	event: APIGatewayProxyEvent,
	context: Context,
): Promise<APIGatewayProxyResult> {
	logger.info('Test Error Handler - Using middyfy utility');
	throw new Error('Unhandled Error from middyfy example');
}

export const handler = middyfy(lambdaHandler);
