// ---- Imports ----------------------------------------------------------------
import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { logger } from '../../../lib/utils/logger';
import { middyfy } from '../../../lib/utils/middyfy';
import { BookModel, createBookModel } from '../models/BookModel';

// ---- Handler ----------------------------------------------------------------
class ListBooksHandler implements LambdaInterface {
	constructor(private readonly bookModel: BookModel) {}

	async handler(_event: APIGatewayProxyEvent): Promise<any> {
		logger.info('List books handler');
		const books = await this.bookModel.listBooks();

		return { data: books };
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<any> {
	const bookModel = createBookModel();
	const instance = new ListBooksHandler(bookModel);
	return await instance.handler(event);
}

export const handler = middyfy(lambdaHandler);
