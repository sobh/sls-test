export class HttpError extends Error {
	statusCode: number;
	context: Record<string, unknown>;
	constructor(
		message?: string,
		statusCode?: number,
		context?: Record<string, unknown>,
		cause?: unknown,
	) {
		super(message ?? 'Http Error');
		this.name = 'HttpError';
		this.cause = cause;
		this.statusCode = statusCode ?? 500;
		this.context = context ?? {};
		this.name = this.constructor.name;
	}
}

export class NotFoundError extends HttpError {
	constructor(message?: string, context?: Record<string, unknown>, cause?: unknown) {
		super(message ?? 'Not Found', 404, context, cause);
	}
}

export class BadRequestError extends HttpError {
	constructor(message?: string, context?: Record<string, unknown>, cause?: unknown) {
		super(message ?? 'Bad Request', 400, context, cause);
	}
}

export class InternalServerError extends HttpError {
	constructor(message?: string, context?: Record<string, unknown>, cause?: unknown) {
		super(message ?? 'Internal Server Error', 500, context, cause);
	}
}

export class ForbiddenError extends HttpError {
	constructor(message?: string, context?: Record<string, unknown>, cause?: unknown) {
		super(message ?? 'Forbidden', 403, context, cause);
	}
}

export class UnauthorizedError extends HttpError {
	constructor(message?: string, context?: Record<string, unknown>, cause?: unknown) {
		super(message ?? 'Unauthorized', 401, context, cause);
	}
}

export class ServiceUnavailableError extends HttpError {
	constructor(message?: string, context?: Record<string, unknown>, cause?: unknown) {
		super(message ?? 'Service Unavailable', 503, context, cause);
	}
}

export class GatewayTimeoutError extends HttpError {
	constructor(message?: string, context?: Record<string, unknown>, cause?: unknown) {
		super(message ?? 'Gateway Timeout', 504, context, cause);
	}
}

export class BadGatewayError extends HttpError {
	constructor(message?: string, context?: Record<string, unknown>, cause?: unknown) {
		super(message ?? 'Bad Gateway', 502, context, cause);
	}
}
