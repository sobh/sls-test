export class NotFoundError extends Error {
	statusCode: number;
	constructor(message?: string, cause?: unknown) {
		super(message ?? 'Not Found');
		this.name = 'NotFoundError';
		this.cause = cause;
		this.statusCode = 404;
	}
}

export class BadRequestError extends Error {
	statusCode: number;
	constructor(message?: string, cause?: unknown) {
		super(message ?? 'Bad Request');
		this.name = 'BadRequestError';
		this.cause = cause;
		this.statusCode = 400;
	}
}

export class InternalServerError extends Error {
	statusCode: number;
	constructor(message?: string, cause?: unknown) {
		super(message ?? 'Internal Server Error');
		this.name = 'InternalServerError';
		this.cause = cause;
		this.statusCode = 500;
	}
}

export class ForbiddenError extends Error {
	statusCode: number;
	constructor(message?: string, cause?: unknown) {
		super(message ?? 'Forbidden');
		this.name = 'ForbiddenError';
		this.cause = cause;
		this.statusCode = 403;
	}
}

export class UnauthorizedError extends Error {
	statusCode: number;
	constructor(message?: string, cause?: unknown) {
		super(message ?? 'Unauthorized');
		this.name = 'UnauthorizedError';
		this.cause = cause;
		this.statusCode = 401;
	}
}

export class ServiceUnavailableError extends Error {
	statusCode: number;
	constructor(message?: string, cause?: unknown) {
		super(message ?? 'Service Unavailable');
		this.name = 'ServiceUnavailableError';
		this.cause = cause;
		this.statusCode = 503;
	}
}

export class GatewayTimeoutError extends Error {
	statusCode: number;
	constructor(message?: string, cause?: unknown) {
		super(message ?? 'Gateway Timeout');
		this.name = 'GatewayTimeoutError';
		this.cause = cause;
		this.statusCode = 504;
	}
}

export class BadGatewayError extends Error {
	statusCode: number;
	constructor(message?: string, cause?: unknown) {
		super(message ?? 'Bad Gateway');
		this.name = 'BadGatewayError';
		this.cause = cause;
		this.statusCode = 502;
	}
}
