<script lang="ts">
  import type { CEnity } from "lib/types";

  export let cell:CEnity;
  export let show:'INDEX'|'DIRECTION' = 'INDEX';
  const isVPrev = cell.prevCell?.featureDirection === 'TOP' || cell.prevCell?.featureDirection === 'BOTTOM';
  const isVCurr = cell?.featureDirection === 'TOP' || cell?.featureDirection === 'BOTTOM';
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<g cursor="pointer" class="Cell" transform="translate({cell.x}, {cell.y})">

  <g>
      <rect
      width = {cell.size}
      height = {cell.size} 
      rx={cell.rounded} ry={cell.rounded}
    />

    {#if cell.index === 0 || cell.featureDirection === undefined}
      <svg 
        width={cell.size}  height={cell.size} >
        <image 
          xlink:href="/imgs/{isVCurr || isVPrev ? 'HStart' : 'VStart'}.png" 
          x="0" y="0"   
          width={cell.size}  
          height={cell.size}/>
      </svg>
    {/if}

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
          {:else if cell.index !== 0}
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
          {:else if cell.index !== 0}
            {cell.index}
          {/if}
        </text>
      </svg>
    {/if}
  </g>
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