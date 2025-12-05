// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent } from 'aws-lambda';
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
async function lambdaHandler(event: APIGatewayProxyEvent): Promise<any> {
	logger.info('Test Internal Call Handler');
	const bookId = event.pathParameters?.id ?? '';
	const uri = `https://${event.requestContext.domainName}/books/${bookId}`;
	logger.debug(`Call to internal service @ ${uri}`);

	const response = await fetch(uri);
	if (!response.ok) {
		logger.error(`Call to internal service @ ${uri} failed with status: ${response.status}`);
	}
	let body;

	// Try to parse as JSON first, otherwise fallback to text
	try {
		body = await response.clone().json();
	} catch (_) {
		body = await response.clone().text();
	}

	const result = { body, headers: Object.fromEntries(response.headers), status: response.status };

	logger.info(`Call to internal service @ ${uri} response:`, { response: result });
	return { message: 'Test Internal Call Handler', response: result };
}

export const handler = middyfy(lambdaHandler);
