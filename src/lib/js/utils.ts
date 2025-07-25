import { browser } from '$app/environment';
import { decode } from 'blurhash';

export function slugify(str = 's') {
	if (!str) return '';
	str = str.replace(/^\s+|\s+$/g, '');

	// Make the string lowercase
	str = str.toLowerCase();

	// Remove accents, swap ñ for n, etc
	var from =
		'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
	var to =
		'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	// Remove invalid chars
	str = str
		.replace(/[^a-z0-9 -]/g, '')
		// Collapse whitespace and replace by -
		.replace(/\s+/g, '-')
		// Collapse dashes
		.replace(/-+/g, '-');

	return str;
}

export function dataURItoBlob(dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	var byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);

	// create a view into the buffer
	var ia = new Uint8Array(ab);

	// set the bytes of the buffer to the correct values
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	var blob = new Blob([ab], { type: mimeString });
	return blob;
}

export function toTitleCase(str) {
	return str.replace(
		/\w\S*/g,
		(text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
	);
}
/**
 *
 * @param {number} size
 * @returns
 */
export function formatFileSize(size) {
	return size > 1024
		? size > 1048576
			? Math.round(size / 1048576) + 'mb'
			: Math.round(size / 1024) + 'kb'
		: size + 'b';
}

export function zodValidationErrors(error: any) {
	let messages: any = {};
	error?.errors.forEach(({ path, message }: any) => {
		if (!messages[path[0]]?.msg) messages[path[0]] = { msg: [], code: 'error' };
		messages[path[0]].msg.push(message);
	});
	return messages;
}
export function blurhash(photo) {
	if (!browser) return;
	if (!photo.blur_hash) return;
	const { hash, w, h } = photo.blur_hash;
	const pixels = decode(hash, w, h, 1);
	// draw it on canvas

	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d');
	const imageData = ctx.createImageData(w, h);
	imageData.data.set(pixels);
	ctx.putImageData(imageData, 0, 0);
	//hash = document.getElementById('hash');
	return canvas.toDataURL();
}
