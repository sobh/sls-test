// ---- Imports ----------------------------------------------------------------
import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { BookModel, createBookModel } from '../../models/BookModel';
import { logger } from '../../services/logger';
import { middyfy } from '../../utils/middyfy';

// ---- Handler ----------------------------------------------------------------
class DeleteBookHandler implements LambdaInterface {
	constructor(private readonly bookModel: BookModel) {}

	async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		logger.info('Delete Book Handler: Start');
		const bookId = event.pathParameters?.bookId ?? '';
		const validId = z.uuidv7().parse(bookId);

		const deletedBookId = await this.bookModel.deleteBook(validId);

		logger.info('Delete Book Handler: Book ID', { deletedBookId });
		return { statusCode: 200, body: JSON.stringify({ uuid: deletedBookId }) };
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const bookModel = createBookModel();
	const instance = new DeleteBookHandler(bookModel);
	return await instance.handler(event);
}

export const handler = middyfy(lambdaHandler);
