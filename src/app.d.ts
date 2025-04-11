// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type Project = {
		id?: string;
		title: string;
		type: string;
		year: number;
		description: string;
		services: string[];
		images: {
			id: string;
			key: string;
			title: string;
		}[];
		featured_image: string;
		index: number;
		is_featured: boolean;
	};
}

export {};
