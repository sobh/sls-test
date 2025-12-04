// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BookModel, createBookModel } from '../../models/BookModel';
import { BookSchema } from '../../schemas/BookSchemas';
import { logger } from '../../services/logger';

// ---- Handler ----------------------------------------------------------------
class CreateBookHandler {
	constructor(private readonly bookModel: BookModel) {}

	async processEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		logger.info('Create Book Handler');
		const body = JSON.parse(event.body ?? '');
		const validBody = BookSchema.parse(body);

		const book = await this.bookModel.createBook(validBody);

		return { statusCode: 200, body: JSON.stringify({ data: book }) };
	}
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		const bookModel = createBookModel();
		const instance = new CreateBookHandler(bookModel);
		return await instance.processEvent(event);
	} catch (error) {
		logger.error('Create book handler error', error as Error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Something went wrong check your log!' }),
		};
	}
}
