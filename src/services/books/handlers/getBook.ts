// ---- Imports ----------------------------------------------------------------
import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { z } from 'zod';
import { NotFoundError } from '../../../lib/errors/http';
import { logger } from '../../../lib/utils/logger';
import { middyfy } from '../../../lib/utils/middyfy';
import { BookModel, createBookModel } from '../models/BookModel';

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
			throw new NotFoundError('Book not found ID: ' + validId, { bookId: validId }, cause);
		}
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<any> {
	const bookModel = createBookModel();
	const instance = new GetBookHandler(bookModel);
	return await instance.handler(event);
}

export const handler = middyfy(lambdaHandler);
