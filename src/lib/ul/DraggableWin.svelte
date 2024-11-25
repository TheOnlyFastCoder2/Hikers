<script lang="ts">
  import IoIosCloseCircle from 'svelte-icons/io/IoIosCloseCircle.svelte'; 

  export let topic:string;
  export let width: string;
  export let height: string;
  export let minWidth: string = '';
  export let minHeight: string = '';
  
  export let 
    left = 0, 
    top  =  0, 
    isOpen = false,
    isCenter = false,
    isNotification = false,
    canDraggable = true;

  let prevClientX = 0, prevClientY = 0; 
  let isDraggable = true;

  export function toCloseWin() {
    isOpen = false;
  }

  export function toOpenWin() {
    toCenterdWin();
    isOpen = true;
  }

  function stop() {
    isDraggable = false;
  }

  function start() {
    isDraggable = true;
  }

  function move(ev:MouseEvent) {
    if(canDraggable) {
      if(isDraggable) {
        left += ev.clientX - prevClientX;
        top += ev.clientY - prevClientY;
      }
      prevClientX = ev.clientX;
      prevClientY = ev.clientY;
    }
  }

  function toCenterdWin() {

    if(isCenter) {
      left = (window.innerWidth - parseFloat(width)) / 2;
      top =  (window.innerHeight - parseFloat(height)) / 2;
      prevClientY = prevClientX = 0;
     
    }
    else if(canDraggable) {
      left = (window.innerWidth - parseFloat(width)) / 5;
      top =  (window.innerHeight - parseFloat(height)) / 5;
    }
  }

</script>

<svelte:window on:resize={toCenterdWin} on:mouseup={stop} on:mousemove={move}/>
{#if isOpen && !isCenter}
  <div class="DraggableWin {isNotification ? "__nottification": ""}" style="left:{left}px;top:{top}px;width:{width};height:{height};min-width:{minWidth};min-height:{minHeight}">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div on:mousedown={start} class="DraggableWin-topbar" style={canDraggable ? "cursor: grab;" : ""}>
        <h3>{topic}</h3>
        <button on:click={toCloseWin}><IoIosCloseCircle/></button>
      </div>
      <div class="DraggableWin-container">
        <slot/>
      </div>
  </div>
{/if}

{#if isOpen && isCenter}
  <div class="background">
      <div class="DraggableWin" style="left:{left}px;top:{top}px;width:{width};height:{height};min-width:{minWidth};min-height:{minHeight}">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:mousedown={start} class="DraggableWin-topbar" style={canDraggable ? "cursor: grab;" : ""}>
          <h3>{topic}</h3>
          <button on:click={toCloseWin}><IoIosCloseCircle/></button>
        </div>
        <div class="DraggableWin-container">
          <slot/>
        </div>
    </div>
  </div> 
{/if}


<style lang="scss">
  .background {
    width: 100%;
    height: 100%;
    position: fixed;
    top:0; left:0;
    z-index: 100;
    background: rgba(var(--dark-400) ,0.30);
    backdrop-filter: blur(2px);
    .DraggableWin {
      box-shadow: 0 0 40px rgba(0,0,0,0.1);
    }
  }

  .DraggableWin {
    display: flex;
    flex-direction: column;
    gap: 1px;
    position: fixed;
    user-select: none;
    // overflow: hidden;
    z-index: 999;

    border-radius: var(--rounded-md);
    background-color: rgb(var(--dark-200));
    outline: 1px solid rgb(var(--dark-200));

    &.__nottification {
      animation: showed 0.3s;
      @keyframes showed {
        0% {top: 100%;}
      }
    }
    
    &-topbar {
      display:flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      min-height: 40px;
      padding: 0 10px;
      color: rgb(var(--dark-200));
      background:  rgb(var(--dark-400));

      button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        color:  rgba(var(--dark-200), 0.8);
      }
    }
    &-container {
      width: 100%;
      height: calc(100% - 40px);
      background: rgb(var(--dark-400));
      border-radius: var(--rounded-md);
    }
  }
</style>