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

export const ProjectSchema = z.object({
	// id: z.string().optional(),
	title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
	type: z.string().min(2, { message: 'Type must be at least 2 characters long.' }),
	year: z.number().min(1900, { message: 'Year must be a valid number (at least 1900).' }),
	description: z
		.string()
		.optional()
		.refine((value) => !value || value.length > 10, {
			message: 'If provided, the Description must be longer than 10 characters.'
		}),
	//services: z
	// .string()
	// .optional()
	// .refine((value) => !value || value.length > 3, {
	// 	message: 'If provided, the Services must be longer than 3 characters.'
	// }),

	services: z
		.array(z.string()) // no .min(1), so empty strings are allowed
		.optional(),
	category: z.string().min(3, { message: 'Category must be at least 3 characters long.' }),
	status: z.enum(['published', 'draft', 'trashed'], {
		message: "Status must be 'published', 'draft', or 'trashed'."
	})
	// images: z.array(z.string().url({ message: "Each image URL must be valid." })),
	// featured_image: z.string().url({ message: "Featured image URL must be valid." }).optional(),
	// index: z.number().int().nonnegative({ message: "Index must be a non-negative integer." }),
	// is_featured: z.boolean(),
	// edit: z.boolean().optional(),
	// createdAt: z.any().optional(),
	// updatedAt: z.any().optional(),
});
