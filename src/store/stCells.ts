import {writable} from 'svelte/store';
import type { CEnity } from 'lib/types';
import crypto from 'crypto-js'
import Einity from 'utils/game/Enity';


const key = 'dcr';
export type TNameMap = {name:string,isComputer:boolean}|undefined;
export function stCells() {
  const {subscribe, update, set} = writable<CEnity[]>([]);
  const nameMap = writable<TNameMap>();

  return {
    subscribe,
    setNameMap: (name:TNameMap) => nameMap.set(name),
    reset: () => {
      nameMap.set({name:'', isComputer:false});
      set([]); 
    },

    getNameMap: () => {
      let name:TNameMap;
      nameMap.subscribe((currName) => {
        name = currName;
        return name;
      });
      return name;
    },

    createNewMap: function (startPosX:number = 0, startPosY:number = 0) {
      set([
        new Einity().setPosition(
          startPosX, startPosY
          ) 
      ]);
      this.setNameMap(undefined);
    },

    addChild: (cell:CEnity) => update((store) => {
      store.push(cell);
      return store;
    }),
    
    removeChild: (cell:CEnity) => update((store) => {
      return store.filter((item) => item !== cell);
    }),
    
    getEncryptMap: ():string => {
      let map:string;
      subscribe((store) => {
        map = crypto.AES.encrypt(JSON.stringify(store), key).toString();
      });

      return map!;
    },

    getMap: (range?:[number,number]): Einity[] => {
      let map:Einity[];
      subscribe((store) => {
        map = range ? store.slice(range[0], range[1]) : store;
      });
      return map!;
    },

    getDencryptMap: (str:string) => {
      const decrypt = crypto.AES.decrypt(str, key).toString(crypto.enc.Utf8);
      return JSON.parse(decrypt) as Einity[]
    },

    toLoadMap: async (map: Einity[], startCell:Einity, startPosX:number = 0, startPosY:number = 0) => {
      startPosX = startPosX - startCell.x;
      startPosY = startPosY - startCell.y;

      map.forEach((cell) => {
        cell.x = startPosX + cell.x;
        cell.y = startPosY + cell.y;
      });

      for(let i = map.length-1; i >= 0; i--) {
        map[i] = Object.assign(new Einity(), map[i]);
        map[i-1] !== undefined && (
          map[i].prevCell = Object.assign(new Einity(), map[i-1])
        )
      }
      set([...map])
    },

    reload: () => update((store) => [...store]), 

    removeAllAfterCell: (cell:CEnity) => {
      update((store) => {
        for(let i = store.length; true; i--) {
          if(cell === store[i]) {
            cell.removeSelf();
            store.splice(i, 1);
            return [...store];
          }
          cell.removeSelf();
          store.splice(i, 1);
        }
      })
    }
  }
}

export default stCells();