<script lang="ts">
  import stCell from "store/stCell";
  import BtnDirection from "./BTNDirection.svelte";
  import type { CEnity, TMode } from "lib/types";

  export let cell:CEnity;
  export let cbToOpenStoreRoles:Function;

  let mode:TMode|'NONE' = 'ADD';
  let canRemoveCurrCell = false;
  export let show:'INDEX'|'DIRECTION' = 'INDEX';

  function toOpenStoreRoles () {
    if(cell.featureDirection !== undefined && cell.index !== 0) {
      stCell.setCell(cell);
      cbToOpenStoreRoles();
    }
  }

  function setMode(ev:KeyboardEvent) {
    const trigger = (ev.code === 'ShiftLeft' || ev.code === 'ControlLeft');

    if(ev.type === 'keydown' && trigger) {
      mode = (
        ev.code === 'ShiftLeft' 
        ? 'ADD' 
        : 'REMOVE'
      );
    } 
    else if(ev.type === 'keyup' && trigger) {
      mode = 'NONE';
      canRemoveCurrCell = false;
    }
  }
  
  function setCanRemoveCurrCell(val:boolean = false) {
    canRemoveCurrCell = val;
  }

  function removeCurrentCell (ev:MouseEvent) {
    ev.preventDefault();
    if(ev.altKey && cell.prevCell) {
      setCanRemoveCurrCell(true)
    }
  }

</script>

<svelte:window on:keyup={setMode} on:keydown={setMode}/>
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<g on:mouseleave={() => setCanRemoveCurrCell()} on:mouseover={removeCurrentCell} cursor="pointer" class="Cell" transform="translate({cell.x}, {cell.y})">
  
  <g on:dblclick={toOpenStoreRoles}>
      <rect
        width = {cell.size}
        height = {cell.size} 
        rx={cell.rounded} ry={cell.rounded}
      />

    {#if cell.role && cell.featureDirection}
      <svg  width={cell.size}  height={cell.size} >
        <image 
          xlink:href="/imgs/roles/{cell.role}.png" 
          x="25%" y="25%"   
          width={cell.size/2}  
          height={cell.size/2} />
      </svg>

      <svg width={cell.size} height={cell.size}>
        <text id="text-sm" x="80%" y="15">
          {#if show === 'DIRECTION'}
            {cell.featureDirection[0]}
          {:else}
            {cell.index}
          {/if}
        </text>
      </svg>
    {/if}

    {#if cell.featureDirection && !cell.role}
      <svg width={cell.size} height={cell.size}>
        <text id="text-lg" x="50%" y="60%">
          {#if show === 'DIRECTION'}
            {cell.featureDirection[0]}
          {:else}
            {cell.index}
          {/if}
        </text>
      </svg>
    {/if}
  </g>

  {#if canRemoveCurrCell}
    <BtnDirection
      cell={cell} 
      mode={'REMOVE'} 
      direct={'CENTER'}
    />
  {/if}
  
  {#if mode === 'ADD'}
    {#each cell['directions']['existing'] as direct }
      {#if direct}
        <BtnDirection
          cell={cell} 
          mode={mode} 
          direct={direct}
        />
      {/if}
    {/each}
  {/if}
  {#if mode === 'REMOVE'}
    {#each cell['directions']['removed'] as direct }
      {#if direct && cell.featureDirection === undefined}
        <BtnDirection
          cell={cell} 
          mode={mode}
          direct={direct}
        />
      {/if}
    {/each}
  {/if}
</g>

<style lang="scss">
  .Cell {
    fill: rgb(var(--dark-bg));
    user-select: none;
    stroke: rgb(var(--dark-200));
    stroke-width: 2;
    filter: drop-shadow(0 0 2px rgba(5, 5, 5, 0.6));
    &:hover #text-lg  {
      fill:  rgba(var(--dark-100), 0.60);
      transition: 0.2s;
    }

    &:hover image  {
      fill: #545470;
      transform: scale(1.2) translate(-10%, -10%);
    }

    image  {
      filter: contrast(0.8);
      transition: 0.6s  ease;
    }
    
    text {
  
      stroke-width: 0;
      transition: 0.2s;
      text-anchor: middle;
      
      &#text-sm {
        font-size: 10px;
        font-weight: 900;
        fill:  rgb(var(--dark-100));
      }

      &#text-lg {
        font-size:17px;
        font-weight: 600;
        letter-spacing: 2px;
        fill:  rgba(var(--dark-100), 0.20);
      }

    }
  }
</style>