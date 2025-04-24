import { z } from 'zod';

export const ResourceSchema = z.object({
	title: z.string(),
	content: z.string(),
	date: z.string(),
	url: z.string(),
	category: z.string(),
	file: z.string(),
	ext: z.string(),
	type: z.string()
});
