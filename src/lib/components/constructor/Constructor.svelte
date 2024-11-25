<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {type CEnity} from "lib/types";
  import Cell from "./Cell/Cell.svelte";
  import stCells from "store/stCells";
  import Scene from "lib/components/Scene.svelte";

  import StoreOfRoles from "./windows/StoreOfRoles.svelte";
  import StoreOfMap from "./windows/StoreOfMap.svelte";
  import SaverMap from "./windows/SaverMap.svelte";
  import Linker from "lib/ul/Linker.svelte";
  import Notification from "lib/ul/Notification.svelte";


  let cells:CEnity[];
  let scene:Scene;
  let notification:Notification;
  let storeOfRoles: StoreOfRoles;
  let storeOfMap: StoreOfMap;
  let saverMap: SaverMap;
  let linkerToHome: Linker;

  let counterChangedOfMap:number = 0;

  onMount(toCreateNewMap);
  onDestroy(() => {
    stCells.reset();
  });
  
  stCells.subscribe((store) => {
    cells = store;
    counterChangedOfMap += 1;
  })
  
  function resetCounter() {
    counterChangedOfMap = 0;
  }

  function toCreateNewMap() {
    const sceneSize =  scene.getSizeScene();
    stCells.createNewMap(
      sceneSize.width/2, 
      sceneSize.height/2
    );
    resetCounter();
    return true;
  }


</script>

<div class="Constructor">
  <Notification 
    bind:this={notification}
    width={400}
    height={150}
    topic={"⚠️ Предупреждение"}
    description={"Карта не сохранена :("}
    buttons = {[[() => {
      saverMap.toOpen()
      ? linkerToHome._setPage()
      : notification.toClose()
    }, 'сохранить'],[() => {
      linkerToHome._setPage();
    }, 'выйти']]}
    />

  <StoreOfRoles bind:this={storeOfRoles}/>
  <StoreOfMap bind:this={storeOfMap} cbResetCounter={resetCounter} toCreateNewMap={toCreateNewMap}/>
  <SaverMap bind:this={saverMap} cbResetCounter={resetCounter} cbRealodListOfMap = {() => storeOfMap.setListOfMap()}/>
  <Scene bind:this={scene} width={window.innerWidth} height={window.innerHeight} offsetHeight={80}>
    {#each cells as cell}
        <Cell cell={cell} show="INDEX" cbToOpenStoreRoles={() => storeOfRoles.toOpen()}/>
    {/each}
  </Scene>
  <div class="Constructor_panel">
    <button class="Constructor_panel_btn" on:click={() => storeOfMap.toOpen()}>выбрать карту</button>
    <button class="Constructor_panel_btn" on:click={() => saverMap.toOpen()}>сохранить карту</button>
    <Linker bind:this={linkerToHome} to="START" justify="END" align='CENTER' onclick={() => {
      const keyMap = stCells.getNameMap();
      if(counterChangedOfMap > 0 || (keyMap === undefined && cells.length > 1) ) {
        notification.toOpen()
        return false;
      }
      return true;
    }}>
      <button class="Constructor_panel_btn linker">в меню</button>
    </Linker>
  </div>
</div>


<style lang="scss">
  .Constructor {
    display: flex;
    flex-direction: column;
    position: relative;

    &_panel {
      display: flex;
      align-items: center;
      padding:0 20px;
      gap: 20px;
      height: 80px;
      border-top: 1px solid rgb(var(--dark-300), 0.7); //#373749
      // background:rgb(var(--dark-400));
      background-color: rgba(var(--dark-300));
      box-shadow: 0 -5px 20px rgba(39, 39, 39, 0.8);

      &_btn, .Linker  {
        // width: 100%;
        text-align: center;
        padding: 10px 20px;
        font-size: medium;
        font-weight: 700;
        color: rgb(var(--dark-400));
        border-radius: var(--rounded-sm);
        border: 1px solid rgb(var(--dark-400));
        transition: 0.2s ease;

        &.linker:last-child{
          margin: 0 auto;
        }

        &:hover {
          transform: scale(1.05);
          box-shadow: -5px -10px rgb(var(--dark-bg));
          background-color: rgba(var(--dark-200));
        }
      }
    }
  }
</style>
