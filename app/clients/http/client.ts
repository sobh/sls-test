// ---- Imports ----------------------------------------------------------------
import axios, { type AxiosInstance } from 'axios';

// ---- Functions ------------------------------------------------------------

/**
 * Create an HTTP client with tracing interceptors
 *
 * @param tracer - The tracer instance
 * @param timeout - The timeout in milliseconds
 * @returns The HTTP client instance
 */
export function createHttpClient(timeout = 5000): AxiosInstance {
	const client = axios.create({ timeout });
	return client;
}

// ---- Exports ----------------------------------------------------------------
export const httpClient = createHttpClient();
