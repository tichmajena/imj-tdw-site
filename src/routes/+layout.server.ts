import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	return {
		...locals,
		url: url.pathname,

		socials: {
			facebook: 'https://www.facebook.com/TDWZW/',
			instagram: 'https://www.instagram.com/troikadesignzw_/',
			linkedin: 'https://www.linkedin.com/company/troika-design-workshop-zimbabwe',
			x: 'https://twitter.com/troikadesignzw?lang=en',
			youtube: 'https://www.youtube.com/@troikadesignworkshop2612',
			houzz: 'https://www.houzz.com/pro/celestkunaka/troika-design-workshop'
		}
	};
}) satisfies LayoutServerLoad;
