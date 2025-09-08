<script>
	let { cloudfront, image } = $props();
	let imageFailed = $state(0);
	let imageRetry = $state(0);
	let zvaramba = $state(false);
	let fitin300 = $state('/fit-in/300x0/');
</script>

<img
	onerror={async (e) => {
		if (imageFailed < 4) {
			imageFailed++;
			zvaramba = true;
		} else {
			zvaramba = true;
		}
		if (imageFailed === 1) {
			fitin300 = '/fit-in/301x0/';
			zvaramba = false;
		} else if (imageFailed === 2) {
			fitin300 = '/fit-in/302x0/';

			zvaramba = false;
		} else if (imageFailed === 3) {
			fitin300 = '/';
			zvaramba = false;
		} else if (imageFailed === 4) {
			// do nothing more
			await fetch('/api/invalidate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify([
					`/fit-in/300x0/${image.name}`
					// `/fit-in/1280x720/${image.name}`,
					// `/fit-in/1440x0/${image.name}`,
					// `/fit-in/1024x0/${image.name}`,
					// `/fit-in/768x0/${image.name}`,
					// `/fit-in/480x0/${image.name}`
				])
			});
			if (imageRetry < 3) {
				imageFailed = 0;
				imageRetry++;
				zvaramba = false;
			} else {
				zvaramba = true;
			}
			console.log('Invalidation requested');
		}

		//e.target.src = `${page.data.cloudfront}/fit-in/770x0/${image.name}`;
	}}
	class:w-0={zvaramba}
	class="mr-1 mb-1 size-24 object-cover"
	src="{cloudfront}{fitin300}{image.name}?webp"
	alt=""
/>
