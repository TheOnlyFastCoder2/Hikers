<script lang="ts">
    import { onMount } from "svelte";
    import stCanvasEffects from "store/stCanvasEffects";
    import useCanvasEffects from "utils/game/useCanvasEffects";

    import type { IPos } from "lib/types";
    import { sizeCell } from "utils/game/game.config";

  let canvasAnim:HTMLCanvasElement;
  let canvasSpriteAnim:HTMLCanvasElement;
  let width = window.innerWidth*2;
  let height = window.innerHeight*2;

  let pos = {
    x: 0,
    y: 0,
    zoom: 1,
  }
  function resizeCanvas() {
    width = window.innerWidth*2;
    height = window.innerHeight*2;
  }

  onMount(() => {
    if(canvasAnim && canvasSpriteAnim) {
      const ctx = canvasAnim.getContext('2d')!;
      const ctxAnim = canvasSpriteAnim.getContext('2d')!;

      stCanvasEffects.setEffects(
        useCanvasEffects(
          {
            toCentered: (p:IPos) => {
              const size = sizeCell * 2;
              const w = (width / 4), h = (height/ 4);
      
              return {
                x: p.x + w,
                y: (p.y + h) - (size - size * (pos.zoom))*(pos.zoom <= 0.50 ? 1 : 0.5),
              }
            },
            toMove: (x:number, y:number, zoom:number) => {
              pos = {x,y,zoom}
            }
          },
          ctx, ctxAnim,
        )
      );
    }
  });

</script>

<svelte:window on:load={resizeCanvas} on:resize={resizeCanvas}/>

<canvas style="left:{-pos.x - width/4}px; top:{-pos.y- height/4}px; transform:scale({pos.zoom})" width={width} height={height}  bind:this={canvasSpriteAnim}/>
<canvas style="left:{-pos.x - width/4}px; top:{-pos.y- height/4}px; transform:scale({pos.zoom})" width={width} height={height}  bind:this={canvasAnim}/>


<style lang="scss">
  canvas {
    position: absolute;
    z-index: 10;
    pointer-events: none;
    transform-origin: center center;
  }
</style>