import {writable} from 'svelte/store';
import type { TPage } from 'lib/types';

export function stPage() {
  const {subscribe, update, set} = writable<TPage>('START');

    return {
      subscribe,
      setPage: (name:TPage) => {set(name)},
      getPage: () => {
        let page:TPage;
        update((name) => {
          return page = name;
        })
        return page!;
      }
    }
}

export default stPage();