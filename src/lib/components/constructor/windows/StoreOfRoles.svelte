<script lang="ts">
  import { DataOfRoles, ERoles } from 'utils/game/game.config';
  import DraggableWin from "lib/ul/DraggableWin.svelte";
  import stCell from "store/stCell";
  import stCells from 'store/stCells';
    import type Einity from 'utils/game/Enity';
  
  let win: DraggableWin;
  let cell:Einity;

  export function toOpen () {
    cell = stCell.getCell()!;
    win.toOpenWin();
  }

  function setNewRole(role:string) {
    cell.role = (
      role === cell.role 
      ? undefined 
      : ERoles[(role as ERoles)]
    );
    stCells.reload();
  }
  
</script>

<DraggableWin bind:this={win} width={'600px'} height={'400px'} topic="Роли для ячейки: {cell?.index}">
  <div class="StoreOfRoles">
    <div class="container">
      {#each Object.entries(DataOfRoles) as [role, data]}
          <button on:click={() => setNewRole(role)} 
            data-name={data.name} 
            class="StoreOfRoles-role {role === cell.role ? "active" : "none"}"
            data-description={data.description}>
            <img src="/imgs/roles/{role}.png" alt=""/>
          </button>
        {/each}
    </div>
  </div>
</DraggableWin>

<style lang="scss">
 .StoreOfRoles {
    position: relative;
    $sizeCell: 60px;
   
    width: 100%;
    height: 100%;
    background: rgb(var(--dark-400));
    padding: 20px;
    overflow-x: hidden;
    // overflow-y: auto;
    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    &:hover {
      overflow-x:visible;
    }

    &-role {
      display: flex;
      justify-content: center;
      align-items: center;
      width: $sizeCell;
      height: $sizeCell;
      border-radius: var(--rounded-md);
      background-color: rgba(var(--dark-200), 0.2);
      img {
        width: 50%;
        transition: 0.6s  ease;
        filter: contrast(1);
      }

      &.active, &:hover {
        background-color: rgba(var(--dark-200), 0.9);
        img {
          filter: contrast(1) drop-shadow(2px 4px 6px rgba(0,0,0,0.5));
          transform: scale(1.2);
        }
      }
      &:hover {
        &[data-description]::before,&[data-name]::after{
          opacity: 1;
          transition-delay: 0.5s;
        }
      }
      &[data-description]::before, &[data-name]::after {
        display: block;
        position: absolute;
        top: 0;
        width: 300px;
        left: calc(100% + 10px);
        padding: 0 10px;
        background-color: rgb(var(--dark-400));
        outline: 1px solid rgba(var(--dark-200));
        border-radius: var(--rounded-md);
        transition: 0.2s ease;
        transition-delay: 0s;
        z-index: 99;
        opacity: 0;
        font-size: 23px;
        // box-shadow: 0 10px 30px -10px  black;
      }
      &[data-name]::after {
        content: attr(data-name);
        z-index: 98;
        padding: 15px auto;
        height: calc(100% - (100% - 70px/2));
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        align-content: center;
        color: #ffffff90;
      }
      &[data-description]::before {
        content: attr(data-description);
        padding-top: 10px;
        height: calc(100% - 45px);
        top: 35px;
        text-align: left;
        text-wrap: balance;
        min-height: auto;
        color: #ffffff90;
        font-size: 14px;
        letter-spacing: 0.2px;
        // height: 200px;
        z-index: 99;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }
</style>
