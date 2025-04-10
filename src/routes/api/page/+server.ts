import { db } from '$lib/server/firebase-admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({url}) => {
    const route = url.searchParams.get('route')?.replaceAll('_-_', '/') || '';
let pageList:any[] = [];
   const page = await db.collection("pages").where("route","==",route).limit(1).get();
page.forEach((doc)=>{
console.log(doc.data());
pageList.push({...doc.data(),id:doc.id});
});
   
    return json(pageList[0]||null);
};