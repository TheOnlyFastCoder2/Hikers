<script lang="ts">
    import { onDestroy } from "svelte";
    import  Einity from "utils/game/Enity";
    import ClUser from "utils/game/User";
    import StoreOfMap from "lib/components/constructor/windows/StoreOfMap.svelte";
    import Linker from "lib/ul/Linker.svelte";

    import User from "./User.svelte";
    import stCells from "store/stCells";
    import getRandomDigit from "utils/getRandomDigit";
    import userActions from "utils/game/userActions";
    import StoreOfCharacters from "./StoreOfCharacters.svelte";
   
    import stUsers from "store/user/stUsers";
    
    import UI from "../UI.svelte";
    import Canvas from "../Canvas.svelte";
    import Finish from "../Finish.svelte";
    import Scene from "../../Scene.svelte";
    import Cell from "../Cell.svelte";

    let CPFinish:Finish;
    let map: Einity[];
    let users: ClUser[];
    let indCurrUser:number;
    let isDisableButton = false;

    $: currUser = users[indCurrUser];

    $: if(currUser?.isDied) {
      nextUser(currUser);
    }

    stCells.subscribe((store) => {
      map = store;
    });

    stUsers.subscribe((store) => {
      users = store;
    })


    function nextUser(currUser:ClUser) {

      currUser.isMe = false;
      const ind = (indCurrUser + 1) % users.length;
      if((!users[ind].isDied && !users[ind].isFinished)) {
        indCurrUser = ind;
        users[indCurrUser].isMe = true;
        stCells.reload();
      } else {
        let i = 0;
        for(const user of users) {
          if(i !== indCurrUser && (!user.isDied && !user.isFinished)) {
            indCurrUser = i;
            user.isMe = true;
            stCells.reload();
            return undefined;
          }
          i++;
        }
      }
      
    }
    
    function toDoStep() {
      const {qntyinishedAndDiedUsers} = stUsers.checkIsAllDeadOrFinished();

      if(qntyinishedAndDiedUsers <= 0) {
        isDisableButton = false;
        
      } else {
        const qntySteps = getRandomDigit(1, 6);
        isDisableButton = true;
        stUsers.toDoStep(
          map,
          currUser, 
          qntySteps, 
          userActions,
          (user: ClUser) => {
            if(map.length-1 === user.indCell) {
              if(!currUser.isFinished) {
                currUser.isFinished = true;
                stUsers.setRank(user);
                CPFinish?.toOpen(user);
                stCells.reload();
              }
            }
          },
          () => {
            nextUser(currUser);
            isDisableButton = false;
          }
        );
      }
    }

    function start(map:Einity[]) {
      if(users.length > 1) {
        users.forEach((user) => {
          user.isMe = false;
          user.setPosition(
            map[0].x,
            map[0].y
          )
        });
        
        users[0].isMe = true;
        indCurrUser = 0;
        stUsers.reload();
        return true;
      }
      return false;
    }
    
    onDestroy(() => {
      stCells.reset();
      stUsers.reset();
    });
  
</script>

{#if map.length <= 0}
  <div class="Room  __maps">
    <div class="container">
      <div class="container __storeOfMap">
        <h2>Выбери Карты</h2>
        <StoreOfMap isConstructor={false} cbToLoadMap={start}/>
      </div>
      <div class="container __characters">
        <StoreOfCharacters/>
      </div>
    </div>
    <Linker to="START" align="END">
      <button class="button">вернуться в меню</button>
    </Linker>
  </div>
  {:else}
  <div class="Room __column">
    <div class="container __scene">
        <Finish  bind:this={CPFinish}/>
        <Canvas/>
        <Scene width={window.innerWidth} height={window.innerHeight} offsetHeight={80}>
          {#each map as cell}
            <Cell cell={cell} show="INDEX"/>
          {/each}
          {#each users as item}
            {#if item.HP > 0}
              <User toFinished={() => CPFinish.toOpen(currUser)} indFinishCell={map.length-1} cell={item} user={currUser} />
            {/if}
          {/each}
        </Scene>
        <UI users={users} user={currUser}/>
      </div>
      <div class="Room_panel">
        <Linker to="START" align='CENTER'>
          <button class="Room_panel_btn">выйти</button>
        </Linker>
        <button on:click={toDoStep} class="Room_panel_btn step" disabled={isDisableButton}>сделать шаг</button>
      </div>
    </div>
  {/if}

<style lang="scss">
  .Room {
    display: flex;
    position: relative;
    flex-direction: column;
    * {
      user-select: none;
    }
    &.__maps {
      gap: 20px;
      & > .container {
        display: flex;
        position: relative;
        align-items: center;
        gap: 20px;
        height: 100%;

        .container.__storeOfMap {
          width: 500px;
          overflow: hidden;
          height: 100%;
          border: 1px solid rgb(var(--dark-300));
          text-align: center;
          h2 {
            padding: 20px 0;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 50px;
            letter-spacing: 0.8px;
            color: rgb(var(--dark-100, 0.6));
            text-shadow: -5px 5px rgb(var(--dark-200));
            border-bottom: 1px solid rgb(var(--dark-300));
            // border-top:none;
          }
        }
      }

      .button {
        display:block;
        padding: 10px 20px;
        font-size: 1rem;
        letter-spacing: 0.12em;
        font-weight: 700;

        color: rgb(var(--dark-100), 0.3);
        border-radius: var(--rounded-sm);
        border: 1px solid rgb(var(--dark-300));
        background-color: rgb(var(--dark-400), 1);
        transition: 0.2s ease;
        
        &:hover {
          color: rgb(var(--dark-400));
          background-color: rgb(var(--dark-100), 0.6);
        }
      }
    }

    &.__column {
      flex-direction: column;
      & > .container {
        position: relative;
        width: 100%;
        height: calc(100% - 80px);
      }
    }
    

    &_panel {
      display: flex;
      align-items: center;
      padding:0 20px;
      gap: 20px;
      height: 80px;
      width: 100%;
      border-top: 1px solid rgb(var(--dark-300), 0.7); //#373749
      // background:rgb(var(--dark-400));
      background-color: rgba(var(--dark-300));
      box-shadow: 0 -5px 20px rgba(39, 39, 39, 0.8);

      &_btn {
        // width: 100%;
        text-align: center;
        padding: 10px 20px;
        font-size: medium;
        font-weight: 700;
        color: rgb(var(--dark-400));
        border-radius: var(--rounded-sm);
       
        border: 1px solid rgb(var(--dark-400));
        transition: 0.2s ease;
        
        &.step {
          margin-left: auto;
  
        }
        &:hover {
          transform: scale(1.05);
          box-shadow: -5px -10px rgb(var(--dark-bg));
          background-color: rgba(var(--dark-200));
        }
      }
    }
  }
</style>
