// ---- Imports ----------------------------------------------------------------
import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { logger } from '../../../lib/utils/logger';
import { middyfy } from '../../../lib/utils/middyfy';
import { BookModel, createBookModel } from '../models/BookModel';
import { BookSchema } from '../schemas/BookSchemas';

// ---- Handler ----------------------------------------------------------------
class CreateBookHandler implements LambdaInterface {
	constructor(private readonly bookModel: BookModel) {}

	async handler(event: APIGatewayProxyEvent): Promise<any> {
		logger.info('Create Book Handler');
		const body = event.body || {};
		const validBody = BookSchema.parse(body);

		const book = await this.bookModel.createBook(validBody);

		return { data: book };
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<any> {
	const bookModel = createBookModel();
	const instance = new CreateBookHandler(bookModel);
	return await instance.handler(event);
}

export const handler = middyfy(lambdaHandler, { parseJson: true });
