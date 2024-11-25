import {writable} from 'svelte/store';
import type {TReturn} from 'utils/game/useCanvasEffects';

interface IMethods {
  showCanvas: Function,
  hideCanvas: Function
}

export function stCanvasEffects() {
  const {subscribe, update, set} = writable<TReturn>();

  return {
    subscribe,
    setEffects: (effects:TReturn) => set(effects),
    getMethods: ():TReturn =>  {
      let effects:TReturn;
      update((value) => effects = value)
      return effects!;
    }
  }
}

export default stCanvasEffects();