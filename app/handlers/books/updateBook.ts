// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { BookModel, createBookModel } from '../../models/BookModel';
import { BookSchema } from '../../schemas/BookSchemas';
import { middyfy } from '../../utils/middyfy';

// ---- Handler ----------------------------------------------------------------
class UpdateBookHandler {
	constructor(private readonly bookModel: BookModel) {}

	async processEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		const bookId = event.pathParameters?.bookId ?? '';
		const validId = z.uuidv7().parse(bookId);
		const body = event.body || {};
		const validBody = BookSchema.parse(body);

		const updatedBook = await this.bookModel.updateBook(validId, validBody);

		return { statusCode: 200, body: JSON.stringify({ data: updatedBook }) };
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const bookModel = createBookModel();
	const instance = new UpdateBookHandler(bookModel);
	return await instance.processEvent(event);
}

export const handler = middyfy(lambdaHandler, { parseJson: true });
