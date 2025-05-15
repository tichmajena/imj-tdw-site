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

export const ContactMessage = z.object({
	name: z.string({ required_error: 'Name is required' }).min(3, { message: 'Name is too short' }),
	email: z
		.string({ required_error: 'Email is required' })
		.min(3, { message: 'Email is required' })
		.email(),
	// subject: z.string({ required_error: 'Email is required' }).min(3, { message: 'Email is required' }),
	message: z
		.string({ required_error: 'Message is required' })
		.min(3, { message: 'Message is too short' })
});
