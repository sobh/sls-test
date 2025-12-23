// ---- Imports ----------------------------------------------------------------
import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { z } from 'zod';
import { middyfy } from '../../../lib/utils/middyfy';
import { BookModel, createBookModel } from '../models/BookModel';
import { BookSchema } from '../schemas/BookSchemas';

// ---- Handler ----------------------------------------------------------------
class UpdateBookHandler implements LambdaInterface {
	constructor(private readonly bookModel: BookModel) {}

	async handler(event: APIGatewayProxyEvent): Promise<any> {
		const bookId = event.pathParameters?.bookId ?? '';
		const validId = z.uuidv7().parse(bookId);
		const body = event.body || {};
		const validBody = BookSchema.parse(body);

		const updatedBook = await this.bookModel.updateBook(validId, validBody);

		return { data: updatedBook };
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<any> {
	const bookModel = createBookModel();
	const instance = new UpdateBookHandler(bookModel);
	return await instance.handler(event);
}

export const handler = middyfy(lambdaHandler, { parseJson: true });
