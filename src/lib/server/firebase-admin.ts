import { FIREBASE_ADMIN } from '$env/static/private';
import admin from 'firebase-admin';
import { initializeFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(FIREBASE_ADMIN);

export const app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

export const db = initializeFirestore(app);
export default admin;

export const getTeam = async () => {
	// Fetch team members from Firestore
	const snapshots = await db.collection('members').orderBy('order', 'asc').get();
	let members: Team[] = [];
	snapshots.forEach((doc) => {
		const member = { ...doc.data(), id: doc.id } as Team;
		members.push(member);
	});
	// console.log(members.map((m) => m.name));

	return members.filter((member) => member.image);
};

export const getPage = async (route_: string) => {
	const route = route_.replaceAll('_-_', '/') || '';
	let pageList: any[] = [];
	const page = await db.collection('pages').where('route', '==', route).limit(1).get();
	page.forEach((doc) => {
		pageList.push({ ...doc.data(), id: doc.id });
	});

	return pageList[0] || null;
};

export const getProjects = async ({
	cat,
	status,
	featured
}: {
	cat: 'project' | 'community' | 'all';
	status: 'published' | 'draft' | 'trashed';
	featured: boolean;
}) => {
	let zvinhu: any = [];
	if (cat === 'all') {
		zvinhu = await db.collection('projects').get();
	} else if (featured) {
		zvinhu = await db
			.collection('projects')
			.where('status', '==', status)
			.where('category', '==', cat)
			.where('is_featured', '==', true)
			.limit(+6)
			.get();
	} else {
		zvinhu = await db
			.collection('projects')
			.where('status', '==', status)
			.where('category', '==', cat)
			.get();
	}
	let projects: any[] = [];

	zvinhu.forEach(extractor);

	function extractor(chinhu: any) {
		let unzippedDoc = chinhu.data();

		let doc_id = chinhu.id;
		let project = {
			...unzippedDoc,
			id: doc_id,
			createdAt: unzippedDoc.createdAt.toDate(),
			updatedAt: unzippedDoc.updatedAt.toDate()
		};
		projects.push(project);
	}

	return projects;
};

export const getProject = async (project_id: string) => {
	const snapshot = await db.collection('projects').doc(project_id).get();
	let doc = snapshot.data();

	return {
		...doc,
		id: snapshot?.id,
		createdAt: doc?.createdAt.toDate(),
		updatedAt: doc?.updatedAt.toDate()
	};
};

export const getResources = async () => {
	let zvinhu = await db.collection('resources').orderBy('order', 'asc').get();
	let resources: any[] = [];

	zvinhu.forEach(extractor);

	function extractor(chinhu: any) {
		let unzippedDoc = chinhu.data();
		let doc_id = chinhu.id;
		let resource = { ...unzippedDoc, id: doc_id };
		resources.push(resource);
	}

	return resources;
};
