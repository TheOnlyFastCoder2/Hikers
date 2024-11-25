<script lang="ts">
  import stCanvasEffects from 'store/stCanvasEffects';
  import * as gameConfig  from 'utils/game/game.config';

  export let sceneWidth:number; 
  export let sceneHeight:number;


  const stepAxis = gameConfig.stepCamera,
        stepZoom = gameConfig.stepZoomCamera;

  let x:number = 1, 
      y:number = 1,
      zoom:number = 1,
      isZooming:boolean = false;
  
  export function toMove() {
    return {
      left: () => x = x + stepAxis * - 1,
      right: () => x = x + stepAxis,
      top: () => y = y + stepAxis * - 1,
      bottom: () => y = y + stepAxis,
    }
  }

  export function getPosCamera() {
    return {x,y}
  }
  export function toMoveCamera(ev:WheelEvent) {
    const canvasMethods = stCanvasEffects.getMethods();
    const delta = ev.deltaY < 0 ? -1 : 1;
    if(ev.shiftKey) {
      x = x + stepAxis * delta;
      canvasMethods?.toMove!(x, y, zoom);
   
    } else if (ev.altKey) {
      y = y + stepAxis * delta;
      canvasMethods?.toMove!(x, y, zoom);
    } else if(ev.ctrlKey) {
      isZooming = true;
      zoom = Math.max(0.3,Math.min(1,
        ev.deltaY < 0 ? zoom + stepZoom : zoom - stepZoom
      ));
      canvasMethods?.toMove!(x, y, zoom);
    }
  }

  export function toHideScaler () {
    isZooming = false;
  }
</script>


<svg width={sceneWidth} height={sceneHeight} viewBox="{x} {y} {sceneWidth} {sceneHeight}">
  <g transform="scale({zoom})" transform-origin="center center">
    <slot/>
  </g>
</svg>
{#if isZooming}
<g
  id="Scaler"
  width="{gameConfig.scaler.width}" 
  height="{gameConfig.scaler.height}" 
  transform="translate(
    {gameConfig.scaler.offsetX}, 
    {gameConfig.scaler.offsetY}
  )"
  >
  <rect 
      fill="red"  
      width="{gameConfig.scaler.width}" 
      height="{gameConfig.scaler.height}"
      rx={gameConfig.rounded}
      ry={gameConfig.rounded}    
  >
  </rect>
  <svg width="{gameConfig.scaler.width}"  height="{gameConfig.scaler.height}">
    <text  x="50%" y="60%">
      {Math.floor(zoom * 100)}%
    </text>
  </svg>
</g>
{/if}
<style lang="scss"> 
  #Scaler {
    user-select: none;
    rect {
      fill: rgb(var(--dark-400));
      stroke: rgb(var(--dark-300), 0.7);
      stroke-width: 2px;
    }
    text {
      text-anchor: middle;
      font-size: 18px;
      fill: rgb(var(--dark-200), 0.7);
    }
  }
</style>


