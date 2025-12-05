// ---- Imports ----------------------------------------------------------------
import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { z } from 'zod';
import { NotFoundError } from '../../errors/http';
import { BookModel, createBookModel } from '../../models/BookModel';
import { logger } from '../../services/logger';
import { middyfy } from '../../utils/middyfy';

// ---- Handler ----------------------------------------------------------------
class GetBookHandler implements LambdaInterface {
	constructor(private readonly bookModel: BookModel) {}

	async handler(event: APIGatewayProxyEvent): Promise<any> {
		const bookId = event.pathParameters?.bookId ?? '';
		const validId = z.uuidv7().parse(bookId);
		logger.info(`Get Book ID: ${validId}`);

		try {
			const book = await this.bookModel.getBook(validId);
			logger.info('Get Book', { book });
			return { data: book };
		} catch (cause) {
			throw new NotFoundError('Book not found ID: ' + validId, cause);
		}
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<any> {
	const bookModel = createBookModel();
	const instance = new GetBookHandler(bookModel);
	return await instance.handler(event);
}

export const handler = middyfy(lambdaHandler);
