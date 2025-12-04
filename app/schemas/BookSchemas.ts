import { z } from 'zod';

export const BookSchema = z.object({ title: z.string() });

export type BookBody = z.infer<typeof BookSchema>;
export type Book = { id: string } & BookBody;
