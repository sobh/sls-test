// ---- Imports ----------------------------------------------------------------
import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BookModel, createBookModel } from '../../models/BookModel';
import { logger } from '../../services/logger';
import { middyfy } from '../../utils/middyfy';

// ---- Handler ----------------------------------------------------------------
class ListBooksHandler implements LambdaInterface {
	constructor(private readonly bookModel: BookModel) {}

	async handler(_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		logger.info('List books handler');
		const books = await this.bookModel.listBooks();

		return { statusCode: 200, body: JSON.stringify({ data: books }) };
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const bookModel = createBookModel();
	const instance = new ListBooksHandler(bookModel);
	return await instance.handler(event);
}

export const handler = middyfy(lambdaHandler);
