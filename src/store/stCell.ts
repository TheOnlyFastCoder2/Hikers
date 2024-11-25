import {writable} from 'svelte/store';
import type Einity from 'utils/game/Enity';
import type { CEnity } from 'lib/types';

export function stCell() {
  const {subscribe, set} = writable<CEnity>();

    return {
      subscribe,
      setCell: (cell:Einity) => set(cell),
      getCell: ():Einity|undefined =>  {
        let cell:Einity|undefined;
        subscribe((currCell) => cell = currCell)
        return cell;
      }
  }
}

export default stCell();