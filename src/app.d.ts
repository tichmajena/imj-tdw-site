// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			cloudfront: string | null;
			theme: string | null;
			user: any;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	// image: {
	// 	id: string;
	// 	key: string;
	// 	title: string;
	// }

	type Project = {
		id?: string;
		title: string;
		type: string;
		year: number;
		description: string;
		services: string[];
		images: string[];
		featured_image?: string;
		index: number;
		is_featured: boolean;
		edit?: boolean;
	};

	type team = {
		id?: string;
		name: string;
		position: string;
		department?: string;
		content?: string;
		image?: string;
		edit?: boolean;
	};
}

export {};
