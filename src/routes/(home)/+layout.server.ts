import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	async function getGallery() {
		return [];
	}
	return {
		gallery: getGallery()
	};
}) satisfies LayoutServerLoad;
