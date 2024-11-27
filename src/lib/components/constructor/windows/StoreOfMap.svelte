<script lang="ts">
    import type { CEnity } from "lib/types";
  import DraggableWin from "lib/ul/DraggableWin.svelte";
  import stCells from "store/stCells";
  import { onMount } from "svelte";
  import Notification from "lib/ul/Notification.svelte";
    import stUsers from "store/user/stUsers";

  let win: DraggableWin;
  let listOfMap: [string, any][] = [];
  let notification: Notification;
  let files: FileList|null = null;

  export let isConstructor:boolean = true;
  export let toCreateNewMap:Function|undefined = undefined;
  export let cbResetCounter: Function|undefined = undefined;
  export let cbToLaodMap: ((map:CEnity[]) => boolean) | undefined = undefined;

  $: console.log(files)
  $: if (files !== null && files.length > 0) {
    toUploadFile(files[0])
  }

  export function toOpen () {
    win.toOpenWin();
  }

  function toLaodMap(key:string, value:string, isComputer: boolean = false) {
    const toLoad = () => {
      const map = stCells.getDencryptMap(value);
      stCells.setNameMap({name:key, isComputer}); 
        stCells.toLoadMap(
          map,
          map[0], 
          window.innerWidth/2, 
          window.innerHeight/2-80,
        );
        stUsers.reloadPosition(map)
        cbResetCounter && cbResetCounter();
        win?.toCloseWin();
    }


    if(cbToLaodMap === undefined) toLoad(); 
    else {
      const map = stCells.getDencryptMap(value);
      const trigger = cbToLaodMap(map);

      if(trigger) toLoad()
      else {
        files = null;
        notification.toOpen()
      }
    }
  }

  function toUploadFile(file:File) {
    const name = file.name.replace(/\.txt$/, '');
    const reader = new FileReader();

    reader.onload = (e) => {
      if(e.target?.result) {
        files = null;
        toLaodMap(name, e.target.result as string, true);
      }  
    }

    reader.onerror = (e) => {
      console.error("Ошибка при чтении файла:", e);
    }

    reader.readAsText(file);
  } 

  function toRemoveMap(keyMap:string, index:number) {
    listOfMap.splice(index, 1);
    localStorage.removeItem(keyMap);
    stCells.setNameMap(undefined);
    listOfMap = [...listOfMap];
  }
  
  export function setListOfMap() {
    listOfMap = [...Object.entries(localStorage)];
  }

  function toFormattedMap(keyMap: string) {
    return keyMap.replace(/^\#H_/, '');
  }

  function isMap(keyMap: string) {
    return /^\#H_/.test(keyMap);
  }

  onMount(() => {
    setListOfMap();
  });
</script>

{#if isConstructor}
  <DraggableWin bind:this={win} width={'600px'} height={'400px'} topic={"Карты"} canDraggable={false} isCenter={true}>
    <div class="StoreOfMap">
        <div class="StoreOfMap_menu">
            <button class="StoreOfMap_menu_btn file">
              <label for="inputUploader">загрузить c компьютера</label>
              {#if files == null}
                <input bind:files={files} id="inputUploader" type="file">
              {/if}
            </button>
            <button class="StoreOfMap_menu_btn" on:click={() => toCreateNewMap && toCreateNewMap()}>новая карта</button>
        </div>
        <div class="StoreOfMap_saved">
          {#each listOfMap as [key, value], index }
            {#if isMap(key)}
              <div class="StoreOfMap_saved_map">
                <span>{toFormattedMap(key)}</span>
                <div class="container">
                    <button on:click={() => toLaodMap(key, value)} class="StoreOfMap_saved_map_btn">открыть</button>
                    <button on:click={() => toRemoveMap(key, index)} class="StoreOfMap_saved_map_btn">удалить</button>
                </div>
              </div>
            {/if}
          {/each}
        </div>
    </div>
  </DraggableWin>
{:else}
  <Notification
    width={400}
    height={150}
    topic={"⚠️ Предупреждение"}
    description={"Создайте пожалуйста несколько персонажей :)"}
    bind:this={notification}
  />
  <div class="StoreOfMap">
    <div class="StoreOfMap_menu">
        <button class="StoreOfMap_menu_btn file">
            <label for="inputUploader">загрузить c компьютера</label>
            {#if files == null}
                <input bind:files={files} id="inputUploader" type="file">
            {/if}
          </button>
    </div>
    <div class="StoreOfMap_saved">
      {#each listOfMap as [key, value], index }
        {#if isMap(key)}
          <div class="StoreOfMap_saved_map">
            <span>{toFormattedMap(key)}</span>
            <div class="container">
                <button on:click={() => toLaodMap(key, value)} class="StoreOfMap_saved_map_btn">открыть</button>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
 .StoreOfMap {
    height: 100%;
    background-color: rgb(var(--dark-400));
    
    &_menu {
      display: flex;
      text-align: center;
      justify-content: end;
      width: 100%;
      height: 40px;
      border-bottom: 1px solid rgb(var(--dark-300));

      &_btn {
        display:block;
        padding: 0 20px;
        height: 100%;
        font-size: 1rem;
        letter-spacing: 0.12em;
        font-weight: 700;
        color: rgb(var(--dark-100), 0.3);
        border-radius: var(--rounded-sm);
        transition: 0.2s ease;
        border-left: 1px solid rgb(var(--dark-300));
        
        &.file {
          input[type="file"]{
            width: 100%;
            height: 100%;
            left:0;
            top:0;
            opacity: 0;
            z-index: -1;
            position: absolute;
          }
          label {
            z-index: 2;
            cursor: pointer;
          }
        }
        &:hover {
          color: rgb(var(--dark-400));
          background-color: rgb(var(--dark-100), 0.6);
        }
      }
    }


    &_saved {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px;
      overflow: scroll;
      height: calc(100% - 40px);
      

      &_map {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 10px 20px;
        border-radius: var(--rounded-md);
        background-color: rgb(var(--dark-100), 0.6);
        box-shadow: 0 20px 10px rgb(0,0,0,0.1);
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        cursor:pointer;
        
        &:hover {
          background-color: rgb(var(--dark-100), 0.6);
        }

        span {
          font-size: 17px;
          font-weight: 800;
          color: rgb(var(--dark-400));
        }
        
        .container {
          display: flex;
          gap: 10px; 
        }

        &_btn {
          // width: 28px;
          // aspect-ratio: 2/2;
          padding: 5px 10px;
          text-align: center;
          font-size: medium;
          font-weight: 700;
          color: rgb(var(--dark-400));
          border-radius: var(--rounded-sm);
          border: 1px solid rgb(var(--dark-400));
          transition: 0.2s ease;

          &:hover {
            transform: scale(1.05);
            box-shadow: -2px -5px rgb(var(--dark-bg));
            // background-color: rgba(var(--dark-200));
          }
        }
      }
    }
  }
    
</style>
