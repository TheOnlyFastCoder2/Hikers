/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module 'svelte-icons/io/*.svelte' {
  import { SvelteComponentTyped } from 'svelte';
  export default class extends SvelteComponentTyped<{}, {}, {}> {}
}