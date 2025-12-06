// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent } from 'aws-lambda';
import axios from 'axios';
import { logger } from '../../services/logger';
import { middyfy } from '../../utils/middyfy';
// ---- Handler ----------------------------------------------------------------

/**
 * Test Internal Traced Call Handler
 *
 * Makes a call to an internal service and returns the response.
 */
async function lambdaHandler(event: APIGatewayProxyEvent) {
	logger.info('Test Internal Traced Call Handler');

	const bookId = event.pathParameters?.id ?? '';
	const uri = `https://${event.requestContext.domainName}/books/${bookId}`;

	logger.info(`Calling internal service @ ${uri}`);
	const response = await axios.get(uri);

	logger.info(`Call to internal service @ ${uri} response:`, { response });

	return {
		message: 'Test Internal Traced Call Handler',
		response: {
			body: response.data,
			headers: response.headers as Record<string, unknown>,
			status: response.status,
		},
	};
}

export const handler = middyfy(lambdaHandler);
