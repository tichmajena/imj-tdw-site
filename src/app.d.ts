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
		category: string;
		status: 'published' | 'draft' | 'trashed';
		createdAt?: any;
		updatedAt?: any;
	};

	type Team = {
		id?: string;
		name: string;
		position: string;
		department?: string;
		content?: string;
		image?: string;
		edit?: boolean;
	};

	type Blurhash = { hash: string; w: number; h: number } | null;

	type FileUpload = {
		file: File;
		blur_hash: Blurhash;
		width: number | string;
		height: number | string;
	};

	type BlobData = {
		name: string;
		img: string;
		data: Blob | null;
		width: number | null;
		height: number | null;
		blur_hash: Blurhash;
		sizeRaw: number | null;
		size: number | null;
		origin: 'upload' | 'gallery';
	};

	type FileMetaData = {
		ext: string;
		key: string;
		project: 'turnbury';
		size: number | null;
		sizeRaw: number | null;
		source: 'aws';
		status: 'published' | 'trashed';
		type: 'image' | 'document' | 'video' | 'audio' | 'application';
		blur_hash: Blurhash;
		width: number | null;
		height: number | null;
		origin?: 'upload' | 'gallery';
	};

	type UploaderClass = {
		worker: Worker;
		progress: {
			[key: string]: { percent: number; success: boolean; error: boolean; done: boolean };
		};
		blobs: { [key: string]: BlobData };
		modals: boolean;
		currentInput: HTMLInputElement;
		selected: FileMetaData[];

		handleMessage: (e: MessageEvent) => void;

		uploadFiles: (message: { type: 'upload'; payload: { files: FileUpload[] } }) => void;

		selectFiles: (file: FileMetaData) => void;

		terminateWorker: () => void;

		launchFilePicker: () => void;
	};
}

export {};
