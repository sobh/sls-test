// ---- Imports ----------------------------------------------------------------
import { Logger } from '@aws-lambda-powertools/logger';
import { LogFormatter, LogItem } from '@aws-lambda-powertools/logger';
import type { LogAttributes, UnformattedAttributes } from '@aws-lambda-powertools/logger/types';

// ---- Internals --------------------------------------------------------------
interface StackFrame {
	function: string | null;
	file: string | null;
	line: number | null;
	column: number | null;
}

class MyCompanyLogFormatter extends LogFormatter {
	/**
	 * Format attributes into a loggable object.
	 *
	 * @param attributes - Unformatted attributes
	 * @param additionalLogAttributes - Additional log attributes
	 */
	public formatAttributes(
		attributes: UnformattedAttributes,
		additionalLogAttributes: LogAttributes,
	): LogItem {
		const baseAttributes = {
			level: attributes.logLevel,
			timestamp: this.formatTimestamp(attributes.timestamp),
			message: attributes.message,
			service: attributes.serviceName,
			traceId: attributes.xRayTraceId,
			requestId: attributes.lambdaContext?.awsRequestId,
			lambda: {
				name: attributes.lambdaContext?.functionName,
				coldStart: attributes.lambdaContext?.coldStart,
				// arn: attributes.lambdaContext?.invokedFunctionArn,
				memory: attributes.lambdaContext?.memoryLimitInMB,
				version: attributes.lambdaContext?.functionVersion,
				sampleRate: attributes.sampleRateValue,
			},
		};

		const logItem = new LogItem({ attributes: baseAttributes });
		// add any attributes not explicitly defined
		logItem.addAttributes(additionalLogAttributes);

		return logItem;
	}

	/**
	 * Format an error into a loggable object.
	 *
	 * @example
	 * ```json
	 * {
	 *   "name": "Error",
	 *   "message": "An error occurred",
	 *   "location": {
	 *     "function": "myFunction",
	 *     "file": "file.js",
	 *     "line": 1,
	 *     "column": 10
	 *   },
	 *   "stack": [
	 *     {
	 *       "function": "myFunction",
	 *       "file": "file.js",
	 *       "line": 1,
	 *       "column": 10
	 *     }
	 *   ],
	 *   "cause": {
	 *     "name": "OtherError",
	 *     "message": "Another error occurred",
	 *     "location": {
	 *       "function": "otherFunction",
	 *       "file": "file.js",
	 *       "line": 2,
	 *       "column": 5
	 *     },
	 *     "stack": [
	 *       {
	 *         "function": "otherFunction",
	 *         "file": "file.js",
	 *         "line": 2,
	 *         "column": 5
	 *       }
	 *     ]
	 *   }
	 * }
	 * ```
	 *
	 * @param error - Error to format
	 */
	formatError(error: Error): LogAttributes {
		const { name, message, stack, cause, ...errorAttributes } = error as any;
		const stackFrames = this.parseErrorStack(error);
		const formattedError: LogAttributes = {
			name,
			message,
			stack: stackFrames,
			cause: cause instanceof Error ? this.formatError(cause) : cause,
		};
		for (const key in error) {
			if (typeof key === 'string' && !['name', 'message', 'stack', 'cause'].includes(key)) {
				formattedError[key] = errorAttributes[key];
			}
		}
		return formattedError;
	}

	parseErrorStack(error: Error): StackFrame[] {
		if (!error.stack) return [];

		const lines = error.stack.split('\n').slice(1); // skip first line (Error message)
		const stack: StackFrame[] = [];

		const regex = /^\s*at\s+(?:(.*?)\s+\()?(.+?):(\d+):(\d+)\)?$/;

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed.startsWith('at ')) continue;

			const match = trimmed.match(regex);
			if (match) {
				const [, functionName, fileName, lineNumber, columnNumber] = match;
				stack.push({
					function: functionName || '<anonymous>',
					file: fileName || null,
					line: parseInt(lineNumber as string) || null,
					column: parseInt(columnNumber as string) || null,
				});
			}
		}

		return stack;
	}
	/**
	 * Get the location of an error from a stack trace.
	 *
	 * @param stack - stack trace to parse
	 */
	getLocation(stack: string): string | undefined {
		if (!stack) {
			return;
		}
		const stackLines = stack.split('\n');
		const regex = /\(([^()]*?):(\d+?):(\d+?)\)\\?$/;
		for (const item of stackLines) {
			const match = regex.exec(item);
			if (Array.isArray(match)) {
				return `${match[1]}:${Number(match[2])}`;
			}
		}
		return;
	}
}

// ---- Exports ----------------------------------------------------------------
export const logger = new Logger({ logFormatter: new MyCompanyLogFormatter() });
