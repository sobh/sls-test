// ---- Imports ----------------------------------------------------------------
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BookModel, createBookModel } from '../../models/BookModel';
import { BookSchema } from '../../schemas/BookSchemas';
import { logger } from '../../services/logger';
import { middyfy } from '../../utils/middyfy';

// ---- Handler ----------------------------------------------------------------
class CreateBookHandler {
	constructor(private readonly bookModel: BookModel) {}

	async processEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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
	return await instance.processEvent(event);
}

export const handler = middyfy(lambdaHandler, { parseJson: true });
