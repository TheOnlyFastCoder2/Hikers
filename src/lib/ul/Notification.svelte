<script lang="ts">
  import DraggableWin from "lib/ul/DraggableWin.svelte";

  export let topic:string;
  export let width:number;
  export let height:number;
  export let description:string;
  export let buttons:Array<[Function, string]>|undefined = undefined;

  let win: DraggableWin;
  let posX = innerHeight - 10 - height;
  let posY = innerWidth - 10 - width;
  export function toOpen () {
    win.toOpenWin();
    posX = innerHeight - 10 - height;
    posY = innerWidth - 10 - width;
  }
  export function toClose () {
    win.toCloseWin();
  }

</script>

<DraggableWin 
  bind:this={win} 
  width="{width}px" height="{height}px"
  isCenter={false}
  top={posX}
  left={posY}
  isNotification={true}
  canDraggable={false} 
  topic={topic}>
  <div class="Notification {buttons === undefined ? "__noButtons" : ""}">
    <div class="wrapper">
      <p>{description}</p>
      {#if buttons}
        <div class="Notification_panel">
          {#each buttons as [cb, text]}
            <button on:click={() => cb()} class="Notification_panel_btn">{text}</button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</DraggableWin>

<style lang="scss">
  .Notification {
    height: 100%;
    padding: 20px;

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      position: relative;
      padding: 0 15px;
      height: 100%;
      color: rgb(var(--dark-100), 0.7);
      font-size:large;
      letter-spacing: 1px;

      p {
        text-wrap: balance;
      }
    }

    &.__noButtons {
      .wrapper {
          align-items: flex-start;
          text-align: start;
          &::before {
          content: "";
          display: block;
          position: absolute;
          top: 0; left:-5px;
          width: 5px;
          height: 100%;
          border-radius: 2px;
          background:  rgb(var(--dark-100));
        }
      }
    }
    &_panel {
      width:fit-content;
      display: flex;
      gap: 10px;
      margin: 0 auto;
      // background: red;
      &_btn {
        display:block;
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
  }
    
</style>
