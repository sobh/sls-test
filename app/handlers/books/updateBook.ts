// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { BookModel, createBookModel } from '../../models/BookModel';
import { BookSchema } from '../../schemas/BookSchemas';
import { logger } from '../../services/logger';

// ---- Handler ----------------------------------------------------------------
class UpdateBookHandler {
	constructor(private readonly bookModel: BookModel) {}

	async processEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		const bookId = event.pathParameters?.bookId ?? '';
		const validId = z.uuidv7().parse(bookId);
		const body = JSON.parse(event.body ?? '');
		const validBody = BookSchema.parse(body);

		const updatedBook = await this.bookModel.updateBook(validId, validBody);

		return { statusCode: 200, body: JSON.stringify({ data: updatedBook }) };
	}
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		const bookModel = createBookModel();
		const instance = new UpdateBookHandler(bookModel);
		return await instance.processEvent(event);
	} catch (error) {
		logger.error('Update book handler error', error as Error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Something went wrong check your log!' }),
		};
	}
}
