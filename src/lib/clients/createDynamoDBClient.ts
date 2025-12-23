import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export function createDynamoDBClient() {
	const client = new DynamoDBClient({});
	const dbDocumentClient = DynamoDBDocumentClient.from(client);
	return dbDocumentClient;
}
