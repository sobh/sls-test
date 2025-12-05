// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { NotFoundError } from '../../errors/http';
import { BookModel, createBookModel } from '../../models/BookModel';
import { logger } from '../../services/logger';
import { middyfy } from '../../utils/middyfy';

// ---- Handler ----------------------------------------------------------------
class GetBookHandler {
	constructor(private readonly bookModel: BookModel) {}

	async processEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		const bookId = event.pathParameters?.bookId ?? '';
		const validId = z.uuidv7().parse(bookId);
		logger.info(`Get Book ID: ${validId}`);

		try {
			const book = await this.bookModel.getBook(validId);
			logger.info('Get Book', { book });
			return { statusCode: 200, body: JSON.stringify({ data: book }) };
		} catch (cause) {
			throw new NotFoundError('Book not found ID: ' + validId, cause);
		}
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const bookModel = createBookModel();
	const instance = new GetBookHandler(bookModel);
	return await instance.processEvent(event);
}

export const handler = middyfy(lambdaHandler);
