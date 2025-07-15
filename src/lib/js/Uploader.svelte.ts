import { getContext, setContext } from 'svelte';

class UploaderWorker {
	worker: Worker;
	progress: {
		[key: string]: {
			percent: number;
			success: boolean;
			error: boolean;
			done: boolean;
			state: 'loaded' | 'uploaded';
			confirm: boolean;
		};
	} = $state({});
	blobs: { [key: string]: any } = $state({});
	modals = $state(false);
	currentInput: any = $state();
	isCurrentMultiple: boolean | undefined = $state();
	selected: { [key: string]: BlobData[] } = $state({});
	activeId: string = $state('');

	constructor(WorkerScript: any) {
		this.worker = new WorkerScript();
		this.worker.onmessage = this.handleMessage.bind(this);
	}

	handleMessage(e: MessageEvent) {
		const { type, payload } = e.data;

		if (type === 'upload-done') {
			this.reset(payload.files);
		} else if (type === 'upload-progress') {
			if (this.progress[payload.name]) {
				this.progress[payload.name].percent = payload.percent;
			}
		} else if (type === 'image-done') {
			if (this.progress[payload.name]) {
				this.progress[payload.name].percent = 0;
				this.progress[payload.name].success = true;
				this.progress[payload.name].done = true;
				this.progress[payload.name].state = 'uploaded';
			}
		} else if (type === 'image-error') {
			if (this.progress[payload.name]) {
				this.progress[payload.name].percent = 0;
				this.progress[payload.name].error = true;
			}
		}
	}

	sendData(num: number) {
		this.worker.postMessage({ num });
	}

	uploadFiles(message: { type: 'upload'; payload: { files: any } }) {
		this.worker.postMessage(message);
	}

	reset(keys: string[]) {
		for (const key of keys) {
			delete this.blobs[key];
			delete this.progress[key];
		}
		setTimeout(() => {
			for (const key of keys) {
				delete this.blobs[key];
				delete this.progress[key];
			}
		}, 3000);
	}

	selectFiles(file: FileMetaData) {
		// image Url
		// source: 'gallery'
		// Can be set as Priview image
		// It is needed in blobs so that in can be used as a privew in other cards
		let image: BlobData = {
			name: file.key,
			img: file.key,
			data: null,
			width: file.width,
			height: file.height,
			blur_hash: file.blur_hash,
			size: file.size,
			sizeRaw: file.sizeRaw,
			origin: 'gallery'
		};
		// this.blobs = { ...this.blobs, [image.name]: image };

		// console.log(file);

		if (!this.selected[this.activeId]) this.selected = { ...this.selected, [this.activeId]: [] };
		this.selected[this.activeId].push(image);
		this.progress = {
			...this.progress,
			[image.name]: {
				done: false,
				percent: 0,
				error: false,
				success: false,
				state: 'loaded',
				confirm: true
			}
		};
		// console.log(this.selected);
	}

	terminateWorker() {
		this.worker.terminate();
		// console.log('Worker terminated.');
	}

	launchFilePicker() {
		this.currentInput.click();
	}
}

const WORKER_KEY = Symbol('DI_UPLOADER_DEM');

export function setUploader(worker: string | URL) {
	const thing = new UploaderWorker(worker);

	return setContext(WORKER_KEY, thing);
}

export function getUploader(source: string) {
	//(WORKER_KEY, source);
	const worker = getContext<ReturnType<typeof setUploader>>(WORKER_KEY);
	//console.log(worker);

	return worker;
}
