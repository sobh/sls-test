// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logger } from '../../services/logger';

// ---- Handler ----------------------------------------------------------------
class TestErrorHandler {
	async processEvent(_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		logger.info('Test Error Handler');
		throw new Error('Unhanded Error');
	}
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		const instance = new TestErrorHandler();
		return await instance.processEvent(event);
	} catch (error) {
		logger.error('Test Error Handler Error', error as Error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Something went wrong check your log!' }),
		};
	}
}
