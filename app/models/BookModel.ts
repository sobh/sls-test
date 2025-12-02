import type { Book, BookBody } from '../schemas/BookSchemas';

import {
	BookRepository,
	createBookRepository,
} from '../repositories/BookRepository';

export class BookModel {
	constructor(
		private readonly repository: BookRepository,
	) {}

	async createBook(bookData: BookBody): Promise<Book> {
		return this.repository.createBook(bookData);
	}

	async getBook(uuid: string): Promise<Book> {
		return this.repository.getBook(uuid);
	}

	async updateBook(uuid: string, bookData: BookBody): Promise<Book> {
		return this.repository.updateBook(uuid, bookData);
	}

	async deleteBook(uuid: string): Promise<string> {
		return this.repository.deleteBook(uuid);
	}

	async listBooks(): Promise<Book[]> {
		return this.repository.listBooks();
	}
}

export function createBookModel(): BookModel {
	const bookRepository = createBookRepository();
	const model = new BookModel(bookRepository);
	return model;
}
