// specific for code highlighting

import { writable, type Writable } from 'svelte/store';

export const storeHighlightJs: Writable<any> = writable(undefined);
