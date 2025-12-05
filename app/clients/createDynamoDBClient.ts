import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { tracer } from '../services/tracer';

export function createDynamoDBClient() {
	const client = new DynamoDBClient({});
	const tracerClient = tracer.captureAWSv3Client(client);
	const dbDocumentClient = DynamoDBDocumentClient.from(tracerClient);
	return dbDocumentClient;
}
