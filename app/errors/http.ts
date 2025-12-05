export class NotFoundError extends Error {
	statusCode: number;
	constructor(message?: string, cause?: unknown) {
		super(message ?? 'Not Found');
		this.name = 'NotFoundError';
		this.cause = cause;
		this.statusCode = 404;
	}
}
