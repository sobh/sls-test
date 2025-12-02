import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { BookModel, createBookModel } from '../models/BookModel';

class ListBooksHandler {
	constructor(
		private readonly bookModel: BookModel,
	) {}

	async processEvent(
		_event: APIGatewayProxyEvent,
	): Promise<APIGatewayProxyResult> {
		const books = await this.bookModel.listBooks();

		return {
			statusCode: 200,
			body: JSON.stringify({
				data: books,
			}),
		};
	}
}

export async function handler(
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
	try {
		const bookModel = createBookModel();
		const instance = new ListBooksHandler(bookModel);
		return await instance.processEvent(event);
	} catch (error) {
		console.error('List books handler error', error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: 'Something went wrong check your log!',
			}),
		};
	}
}
