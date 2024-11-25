<script lang="ts">
  import Constructor from "lib/components/constructor/Constructor.svelte";
  import RoomOffline from "lib/components/room/offline/Room.svelte";
  import RoomOnline from "lib/components/room/online/Room.svelte";

  import type { TPage } from "lib/types";
  import MobileWarning from "lib/ul/MobileWarning.svelte";
  import stPage from "store/stPage";
  import { onMount } from "svelte";

  const setConstrcutor = () => stPage.setPage('CONSTRUCTOR');
  const setRoomOffline = () => stPage.setPage('ROOM_OFFLINE');
  const setRoomOnline = () => stPage.setPage('ROOM_ONLINE');

  let currPage:TPage;
  stPage.subscribe((val) => {
    currPage = val;
  });

  onMount(() => {
    stPage.setPage('START');
  });

</script>


<div class="App">
  <MobileWarning/>
  {#if currPage === 'START'}
    <div class="App_menu">
      <h3>Hikers</h3>
      <div class="container">
        <button on:click={setRoomOffline} class="App_menu_btn">создать комнату</button>
        <!-- <button on:click={setRoomOnline} class="App_menu_btn">играть онлайн</button> -->
        <button on:click={setConstrcutor} class="App_menu_btn">открыть конструктор карты</button>
      </div>
    </div>
  {:else if currPage === 'CONSTRUCTOR'}
    <Constructor/>
  {:else if currPage === 'ROOM_OFFLINE'}
    <RoomOffline/>
  {:else if currPage === 'ROOM_ONLINE'}
    <RoomOnline/>
  {/if}
  
</div>

<style lang="scss">
  .App {
    display: grid;
    place-content: center;
    width: 100%;
    height: 100%;
    background: rgb(var(--dark-400));

    &_menu {
      width: 300px;
      height: 200px;
      border-radius: var(--rounded-md);
      background-color: rgba(var(--dark-100));

      h3 {
        font-size: xx-large;
        font-weight: 900;
        letter-spacing: 2px;
        color: rgba(var(--dark-400));
        text-shadow: -4px 2px rgba(var(--dark-200), 0.4);
      }
      &, .container  {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px; 
      }

      &_btn {
        width: 100%;
        text-align: center;
        padding: 10px 20px;
        font-size: medium;
        font-weight: 700;
        color: rgb(var(--dark-300));
        border-radius: var(--rounded-sm);
        border: 1px solid rgb(var(--dark-400));
        transition: 0.2s ease;

        &:hover {
          transform: scale(1.05);
          box-shadow: -5px 10px rgb(var(--dark-bg));
        }
      }
    }
  }
</style>
