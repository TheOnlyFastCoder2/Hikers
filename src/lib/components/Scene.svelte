<script lang="ts">
  import type { ISize } from "lib/types";
  import Camera from "./Camera.svelte";
    import stCells from "store/stCells";
    import  stUsers from "store/user/stUsers";

  let camera:Camera;
  export let width:number;
  export let height:number;
  export let offsetWidth:number = 0;
  export let offsetHeight:number = 0;

  width = width - offsetWidth;
  height = height - offsetHeight;
  
  export function getSizeScene(): ISize {
    return {width, height};
  }

  function toResizeScene() {
    width = window.innerWidth - offsetWidth;
    height = window.innerHeight - offsetHeight;
    const map = stCells.getMap();
    const pos = camera.getPosCamera();
    if(map) {
      stCells.toLoadMap(
        map,
        map[0], 
        (width + pos.x)/2, 
        (height + pos.y)/2,
      );
      stUsers.reloadPosition(map)
    }  
  }
</script>

<svelte:window on:resize={toResizeScene} on:keyup={camera.toHideScaler} on:mouseleave={camera.toHideScaler}/>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg on:wheel|preventDefault|nonpassive={camera.toMoveCamera} class="Scene" width={width} height={height} viewBox="0 0 {width} {height}">
  <Camera  bind:this={camera} sceneWidth={width} sceneHeight={height} >
    <slot/>
  </Camera>
</svg>

<style lang="scss">
  .Scene {
    position: relative;
    background-color: #2b2a31;
  }
</style>