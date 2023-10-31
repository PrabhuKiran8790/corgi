import { writable } from 'svelte/store';

export const darkmode = writable(true);
export const premiumDialogOpen = writable(false);
export const pricingDialogOpen = writable(false)

export const premiumTierLimitDialogOpen = writable<{
	open: boolean;
	serviceType: 'image' | 'audio' | 'imageRestoration' | null;
}>({
	open: false,
	serviceType: null
});

export const toLink = writable('');
