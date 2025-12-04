import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';
import { BookModel, createBookModel } from '../../models/BookModel';
import { logger } from '../../services/logger';

class DeleteBookHandler {
	constructor(private readonly bookModel: BookModel) {}

	async processEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		logger.info('Delete Book Handler: Start');
		const bookId = event.pathParameters?.bookId ?? '';
		const validId = z.uuidv7().parse(bookId);

		const deletedBookId = await this.bookModel.deleteBook(validId);

		logger.info('Delete Book Handler: Book ID', { deletedBookId });
		return { statusCode: 200, body: JSON.stringify({ uuid: deletedBookId }) };
	}
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		const bookModel = createBookModel();
		const instance = new DeleteBookHandler(bookModel);
		return await instance.processEvent(event);
	} catch (error) {
		logger.error('Delete book handler error', error as Error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Something went wrong check your log!' }),
		};
	}
}
