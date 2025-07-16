<script>
	import IconArrow from '$icons/IconArrow.svelte';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css/core';
	import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
	import { slide, fly, fade, scale } from 'svelte/transition';
	import { page } from '$app/stores';

	export let items = [];
	export let optsMain = {};
	export let optsDots = {};
	export let autoscroll = false;

	export let center;

	let height = '25rem';

	const optionsMain = {
		type: 'loop',
		autoplay: true,
		rewind: false,
		perPage: 1,
		gap: '0px',
		autoHeight: true,
		pagination: false
	};

	const optionsDots = {
		type: 'slide',
		rewind: true,
		gap: '0.5rem',
		pagination: false,
		fixedWidth: 18,
		fixedHeight: 18,
		cover: false,
		isNavigation: true,
		updateOnMove: true,
		arrows: false
	};

	let main, dots, side;

	console.log({ ...optionsMain, ...optsMain });

	// onMount(() => {
	//   if (main && dots && side) {
	//     main.sync(dots.splide);
	//     main.sync(side.splide);
	//   } else if (main && dots) {
	//     main.sync(dots.splide);
	//   }

	// });
</script>

<div class="flex w-full">
	<div class="bg-cgray-100 w-full">
		<Splide
			bind:this={main}
			options={{ ...optionsMain, ...optsMain }}
			hasTrack={false}
			aria-label="..."
			extensions={autoscroll ? { AutoScroll } : {}}
		>
			<div class="relative">
				<SplideTrack>
					{#each items as { component, props }, i}
						<SplideSlide>
							<svelte:component this={component} {...props} />
						</SplideSlide>
					{/each}
				</SplideTrack>
			</div>
			<div class="relative container mt-8 flex w-full justify-end">
				<div class="splide__arrows flex space-x-3">
					<button class="splide__arrow splide__arrow--prev h-12"><IconArrow /></button>
					<button class="splide__arrow splide__arrow--next h-12 rotate-180"><IconArrow /></button>
				</div>
			</div>
		</Splide>
		<!-- <div class:justify-center={center} class="-mt-8 flex">
          <Splide
            bind:this={dots}
            options={{ ...optionsDots, ...optsDots }}
            hasTrack={false}
            aria-label="..."
          >
            <SplideTrack>
              {#each items as { dot }, i}
                <SplideSlide>
                  <svelte:component this={dot} />
                </SplideSlide>
              {/each}
            </SplideTrack>
          </Splide>
        </div> -->
	</div>
</div>

<style lang="postcss">
	.w23 {
		@apply w-11/12 rounded-tr-2xl rounded-br-2xl shadow-lg md:w-3/4;
	}

	/* .splide__track--nav > .splide__list > .splide__slide.is-active {
      }
      .is-active > .bg-emerald-500 {
      } */
</style>
