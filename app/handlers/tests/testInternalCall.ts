// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logger } from '../../services/logger';
import { middyfy } from '../../utils/middyfy';

// ---- Handler ----------------------------------------------------------------

/**
 * Test Internal Call Handler
 *
 * Makes a call to an internal service and returns the response.
 *
 * @param event - The API Gateway event
 * @param context - The Lambda context
 * @returns The API Gateway response
 */
async function lambdaHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	logger.info('Test Internal Call Handler');
	const uri = `https://${event.requestContext.domainName}/books`;
	logger.debug(`Call to internal service @ ${uri}`);

	const response = await fetch(uri);
	if (!response.ok) {
		logger.error(`Call to internal service @ ${uri} failed with status: ${response.status}`);
	}
	// Clone the response so we can read the body safely
	const clone = response.clone();
	let body;

	// Try to parse as JSON first, otherwise fallback to text
	try {
		body = await clone.json();
	} catch (_) {
		body = await clone.text();
	}

	const result = { body, headers: Object.fromEntries(response.headers), status: response.status };

	logger.info(`Call to internal service @ ${uri} response:`, { response: result });
	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Test Internal Call Handler', response: result }),
	};
}

export const handler = middyfy(lambdaHandler);
