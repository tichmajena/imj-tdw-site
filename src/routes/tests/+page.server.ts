import { db } from '$src/lib/server/firebase-admin';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {};
	let pages: any = [];
	const snaps = await db.collection('pages').get();
	console.log(pages.length);
	snaps.forEach((item) => {
		pages.push({ ...item.data(), id: item.id });
	});
	let i = 0;
	const batch = db.batch();
	let toUpdate: string[] = [];
	for (const page of pages) {
		// console.log(page.route);
		// get entry and parse it
		let entry = JSON.parse(page.entry);
		// add sidebar and stringify

		if (entry.sidebar) {
			entry.sidebar = entry.sidebar.map((block: any) => {
				let image = block.image;
				if (block.image.indexOf('cloudfront')) {
					image = block.image.split('/')[block.image.split('/').length - 1];
				}
				return {
					...block,
					image
				};
			});
		}

		entry.body = entry.body.map((block: any) => {
			let image = block.image;
			if (block.image.indexOf('cloudfront')) {
				console.log(block.image);
				if (!toUpdate.includes(page.id)) toUpdate.push(page.id);

				image = block.image.split('/')[block.image.split('/').length - 1];
			}

			return {
				...block,
				image
			};
		});

		//console.log(entry.sidebar);
		//console.log(entry.body);
		entry = JSON.stringify(entry);

		if (toUpdate.includes(page.id))
			batch.set(db.collection('pages').doc(page.id), { entry }, { merge: true });

		// const p = await prisma.page.update({
		// 	where: {
		// 		id: page.id
		// 	},
		// 	data: {
		// 		entry
		// 	}
		// });
		i++;
		console.log(i + ' out of ' + pages.length + ' set', page.route);
	}
	// await batch.commit();
	console.log({ toUpdate });
	return {};
}) satisfies PageServerLoad;
