<script lang="ts">
  import DraggableWin from "lib/ul/DraggableWin.svelte";
    import Notification from "lib/ul/Notification.svelte";
  import stCells from "store/stCells";

  let win: DraggableWin;
  let inputVal:string;
  let canIsSaveOnComputer = false;
  let isResave = false;
  let notification: Notification;
  export let cbRealodListOfMap: Function;
  export let cbResetCounter: Function;

  $: forWebSite = canIsSaveOnComputer ? '' : 'active';
  $: forComputer = canIsSaveOnComputer ? 'active' : '';  

  export function toOpen () {
    const keyMap = stCells.getNameMap();
    if(keyMap === undefined) {
      win.toOpenWin();
      isResave = false;
    } else {
      isResave = true;
      inputVal = keyMap.name;
      win.toOpenWin()
    }

    cbResetCounter();
    return keyMap ? true : false;
  }
  
  function toSaveMap(keyMap: string, isComputer:boolean = false) {

    if(keyMap.length > 0 ) {
      if(canIsSaveOnComputer || isComputer) {
        const link = document.createElement('a');
        const text = stCells.getEncryptMap();
        link.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
        link.download = keyMap;
        link.click();
        URL.revokeObjectURL(link.href);
        stCells.setNameMap({name: keyMap, isComputer:true});
      } else {

        try {
          stCells.setNameMap({name: keyMap, isComputer:false});
          localStorage.setItem(`#H_${keyMap}`, stCells.getEncryptMap());
          win.toCloseWin();
          inputVal = '';
        } catch (error) {
          notification.toOpen();
        }
      }

      cbRealodListOfMap(); 
      cbResetCounter();
    }
  }
  
  function canToSaveOnComputer(trigger: boolean) {
    canIsSaveOnComputer = trigger;
  }
  function cancel() {
    inputVal = '';
    win.toCloseWin();
  }
</script>

<Notification
  width={400}
  height={150}
  topic={"⚠️ Предупреждение"}
  description={"Недостаточно памати на сайте, чтобы сохранить эту карту :("}
  bind:this={notification}
/>
<DraggableWin 
  bind:this={win} 
  width={'400px'} height={isResave ? '120px' : '220px'}
  isCenter={true}
  canDraggable={false} 
  topic={"Укажите имя карты"}>
  {#if isResave}
      <div class="SaverMap">
        <div class="wrapper">
        <div class="SaverMap_modes {isResave ? '__reseved' : ''}">
          <button on:click={() => toSaveMap(inputVal, true)} class="SaverMap_modes_btn button">на компьютер</button>
          <button on:click={() => toSaveMap(inputVal, false)} class="SaverMap_modes_btn button">на сайт</button>
        </div>
      </div>
    </div>
  {:else}
    <div class="SaverMap">
      <div class="wrapper">
        <div class="SaverMap_modes">
          <button on:click={() => canToSaveOnComputer(true)} class="SaverMap_modes_btn button {forComputer}">на компьютер</button>
          <button on:click={() => canToSaveOnComputer(false)} class="SaverMap_modes_btn button {forWebSite}">на сайт</button>
        </div>
        <input bind:value={inputVal} placeholder="имя карты..." class="SaverMap_input" type="text">
        <div class="container">
            <button on:click={() => toSaveMap(inputVal)} class="SaverMap_btn">сохранить</button>
            <button on:click={cancel} class="SaverMap_btn">отмена</button>
        </div>
      </div>
    </div>
  {/if} 
</DraggableWin>


<style lang="scss">
  .SaverMap {
    height: 100%;
    display: flex;
    
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .wrapper {
      width:fit-content;
    }

    .container {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }

    &_modes {
      display: flex;
      width: 300px;
      height: 30px;
      margin-bottom: 10px;
      gap: 1px;
      border-left: 1px solid rgb(var(--dark-300));
      border-right: 1px solid rgb(var(--dark-300));
      background-color: rgb(var(--dark-300));

      &_btn {
        width: 100%;
        height: 100%;
        border:none;
        padding: 0 5px;
        font-size: small;
        border-radius: 0;
      }

      &.__reseved {
        gap: 10px;
        width: 350px;
        height: 40px;
        background: none;
        border:none;
        .SaverMap_modes_btn {
          font-size: medium;
          padding: 0 20px;
          border: 1px solid rgb(var(--dark-300));
        }
      }
    }

    &_input {
      font-size: large;
      letter-spacing: 1px;
      color: rgb(var(--dark-200));
      border-radius: var(--rounded-sm);
      border: 1px solid rgb(var(--dark-300));
      padding: 10px;
      width: 100%;
      margin-bottom: 15px;

      &::placeholder {
        color: rgb(var(--dark-300));
        text-transform: capitalize;
      }
    }

    &_btn {
        display:block;
        width: 100%;
        padding: 5px 20px;
        font-size: 1rem;
        letter-spacing: 0.12em;
        font-weight: 700;
        color: rgb(var(--dark-100), 0.3);
        border-radius: var(--rounded-sm);
        border: 1px solid rgb(var(--dark-300));
        transition: 0.2s ease;
        
        &:hover {
          color: rgb(var(--dark-400));
          background-color: rgb(var(--dark-100), 0.6);
        }
      }
  }
    
</style>
