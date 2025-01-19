<script lang="ts">
  import storeCells from "store/stCells";
  import Einity from "utils/game/Enity";
  import { stepBtn } from "utils/game/game.config";
  import type { CEntity, TDirect, TMode } from "lib/types";

  let fill:string = 'green';
  export let cell:CEntity;
  export let direct:TDirect|'CENTER';
  export let mode: TMode;

  const computedSide = {
    center: cell.size / 4,
    TOP: function (ind:number)  {return [this.center, -cell.size / 2 -stepBtn][ind]},
    LEFT: function (ind:number)  {return [-cell.size / 2 -stepBtn, this.center][ind]},
    BOTTOM: function (ind:number)  {return [this.center, cell.size + stepBtn][ind]},
    RIGHT: function (ind:number)  {return [cell.size + stepBtn, this.center][ind]},
    CENTER: function (ind:number)  {return [this.center, this.center][ind]},
  }

  function addOrRemoveCell(direct: TDirect): Function {
    switch(mode) {
      case 'ADD': 
      return () => (
          storeCells
            .addChild(
              new Einity()
              .createCell(direct, cell)
            )
        );
      case 'REMOVE': 
      return () => (
          storeCells
            .removeChild(
              cell.removeSelf()
            )
        );
    }
  }
  function toListenerMouse(ev:MouseEvent)  {
    const toDoAction = (action: Function) => {
      ev.type === 'mouseover' && (ev.shiftKey || ev.ctrlKey) && ev.buttons === 1
      ? action()
      : (ev.type === 'click' 
          && action());
    }
    
    direct !== 'CENTER'
    ? toDoAction(addOrRemoveCell(direct))
    : (ev.type === 'click' 
        && storeCells.removeAllAfterCell(cell));
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<g on:mouseover={toListenerMouse} on:click={toListenerMouse}  cursor="pointer" transform="translate({computedSide[direct](0)}, {computedSide[direct](1)})">
  <rect 
    fill={fill}
    width={cell.size/2}
    height={cell.size/2}
    rx={cell.rounded/1.5} 
    ry={cell.rounded/1.5}
  />

    <path id="path" d="M12 15L18 15"/>
    {#if mode === 'ADD'}
      <path id="path" d="M15 12L15 18"/>
    {/if}
</g>

<style lang="scss">
  rect {
    fill: rgb(var(--dark-300));
    filter: drop-shadow(0 0 2px rgba(5, 5, 5, 0.103));
    stroke-width: 1;
  }
  path {
    stroke:  rgb(var(--dark-100));
    stroke-width: 1;
    stroke-linecap: round;
  }
</style>

