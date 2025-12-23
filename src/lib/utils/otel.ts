// ---- Imports ----------------------------------------------------------------
import { context, trace } from '@opentelemetry/api';

// ---- Exports ----------------------------------------------------------------
export function getTraceId(): string | undefined {
	const activeCtx = context.active();
	const span = trace.getSpan(activeCtx);
	if (!span) return;

	const spanContext = span.spanContext();
	if (!spanContext) return;

	// Convert OTel TraceID → AWS X-Ray compatible format
	return `1-${spanContext.traceId.substring(0, 8)}-${spanContext.traceId.substring(8)}`;
}

export function getSpanId(): string | undefined {
	const activeCtx = context.active();
	const span = trace.getSpan(activeCtx);
	if (!span) return;

	const spanContext = span.spanContext();
	if (!spanContext) return;

	return spanContext.spanId;
}

export function injectTraceHeader(headers: Record<string, string> = {}): Record<string, string> {
	const activeCtx = context.active();
	const span = trace.getSpan(activeCtx);
	if (!span) return headers;

	const spanContext = span.spanContext();
	if (!spanContext) return headers;

	// Convert OTel TraceID → AWS X-Ray compatible format
	const traceId = spanContext.traceId;
	const parentId = spanContext.spanId;
	const sampled = spanContext.traceFlags === 1 ? '1' : '0';

	headers['X-Amzn-Trace-Id'] = `Root=1-${traceId.substring(0, 8)}-${
		traceId.substring(8)
	};Parent=${parentId};Sampled=${sampled}`;

	return headers;
}
