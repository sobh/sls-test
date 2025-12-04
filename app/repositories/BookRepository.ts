// ---- Imports ----------------------------------------------------------------
import type { Book, BookBody } from '../schemas/BookSchemas';

import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	ScanCommand,
	UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { uuidv7 } from 'uuidv7';

import { createDynamoDBClient } from '../clients/creatDynamoDBClient';

// ---- Constants -------------------------------------------------------------
const TABLE_NAME = process.env.BOOKS_TABLE_NAME;

export class BookRepository {
	constructor(private readonly dbClient: DynamoDBDocumentClient) {}

	async createBook(bookdata: BookBody): Promise<Book> {
		const id = uuidv7();
		const cmd = new PutCommand({ TableName: TABLE_NAME, Item: { id, title: bookdata.title } });
		await this.dbClient.send(cmd);

		return { id, title: bookdata.title };
	}

	async getBook(uuid: string): Promise<Book> {
		const cmd = new GetCommand({ TableName: TABLE_NAME, Key: { id: uuid } });
		const res = await this.dbClient.send(cmd);
		if (!res.Item) {
			throw new Error('Book not found');
		}

		return res.Item as Book;
	}

	async updateBook(uuid: string, bookdata: BookBody): Promise<Book> {
		const cmd = new UpdateCommand({
			TableName: TABLE_NAME,
			Key: { id: uuid },
			UpdateExpression: 'set title = :title',
			ExpressionAttributeValues: { ':title': bookdata.title },
		});
		await this.dbClient.send(cmd);
		return { id: uuid, title: bookdata.title };
	}

	async deleteBook(uuid: string): Promise<string> {
		const cmd = new DeleteCommand({ TableName: TABLE_NAME, Key: { id: uuid } });
		await this.dbClient.send(cmd);
		return uuid;
	}

	async listBooks(): Promise<Book[]> {
		const cmd = new ScanCommand({ TableName: TABLE_NAME });
		const res = await this.dbClient.send(cmd);
		return res.Items as Book[];
	}
}

export function createBookRepository(): BookRepository {
	const dbClient = createDynamoDBClient();
	return new BookRepository(dbClient);
}
