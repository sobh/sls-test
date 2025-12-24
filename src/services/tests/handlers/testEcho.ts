// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { logger } from '../../../lib/utils/logger';
import { middyfy } from '../../../lib/utils/middyfy';

// ---- Types ------------------------------------------------------------------
interface EchoEvent extends Omit<APIGatewayProxyEvent, 'body'> {
	body: Record<string, any>;
}

// ---- Handler ----------------------------------------------------------------

/**
 * Test Echo Handler
 *
 * Receives a JSON body and returns it with a message.
 *
 * @param event - The API Gateway event
 * @param context - The Lambda context
 * @returns The API Gateway response
 */
async function lambdaHandler(event: EchoEvent, context: Context): Promise<any> {
	logger.info('Echo handler - received request', { body: event.body });

	// Get the parsed JSON body (thanks to http-json-body-parser middleware)
	const requestBody = event.body || {};

	// Add a message to the received object
	const responseBody = {
		...requestBody,
		message: 'Echo response from Lambda',
		timestamp: new Date().toISOString(),
	};

	logger.info('Echo handler - sending response ', { response: responseBody });

	return responseBody;
}

export const handler = middyfy(lambdaHandler, { parseJson: true });
