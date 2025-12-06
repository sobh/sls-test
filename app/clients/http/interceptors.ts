// ---- Imports ----------------------------------------------------------------
import axios, { AxiosError } from 'axios';
import { BadGatewayError, GatewayTimeoutError } from '../../errors/http';

/**
 * Create an error interceptor for HTTP errors
 *
 * @returns The error interceptor function
 */
export function createErrorInterceptor(): (err: unknown) => Promise<never> {
	return (err: unknown): Promise<never> => {
		if (!axios.isAxiosError(err)) return Promise.reject(err);

		const axErr = err as AxiosError;
		if (axErr.code === 'ECONNABORTED' || !axErr.response) {
			return Promise.reject(new GatewayTimeoutError('Upstream service timed out', axErr));
		}

		return Promise.reject(
			new BadGatewayError(
				`Upstream service returned status ${axErr.response?.status}`,
				axErr,
			),
		);
	};
}
