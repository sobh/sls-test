// ---- Imports ----------------------------------------------------------------
import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BookModel, createBookModel } from '../../models/BookModel';
import { BookSchema } from '../../schemas/BookSchemas';
import { logger } from '../../services/logger';
import { middyfy } from '../../utils/middyfy';

// ---- Handler ----------------------------------------------------------------
class CreateBookHandler implements LambdaInterface {
	constructor(private readonly bookModel: BookModel) {}

	async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		logger.info('Create Book Handler');
		const body = event.body || {};
		const validBody = BookSchema.parse(body);

		const book = await this.bookModel.createBook(validBody);

		return { statusCode: 200, body: JSON.stringify({ data: book }) };
	}
}

async function lambdaHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	const bookModel = createBookModel();
	const instance = new CreateBookHandler(bookModel);
	return await instance.handler(event);
}

export const handler = middyfy(lambdaHandler, { parseJson: true });
