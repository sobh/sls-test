import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { z } from 'zod';

import { BookModel, createBookModel } from '../models/BookModel';

class GetBookHandler {
	constructor(
		private readonly bookModel: BookModel,
	) {}

	async processEvent(
		event: APIGatewayProxyEvent,
	): Promise<APIGatewayProxyResult> {
		const bookId = event.pathParameters?.bookId ?? '';
		const validId = z.uuidv7().parse(bookId);

		const book = await this.bookModel.getBook(validId);

		return {
			statusCode: 200,
			body: JSON.stringify({
				data: book,
			}),
		};
	}
}

export async function handler(
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
	try {
		const bookModel = createBookModel();
		const instance = new GetBookHandler(bookModel);
		return await instance.processEvent(event);
	} catch (error) {
		console.error('Get book handler error', error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: 'Something went wrong check your log!',
			}),
		};
	}
}
