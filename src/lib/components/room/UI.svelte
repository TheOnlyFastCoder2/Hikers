<script lang="ts">
  import type { CUser } from "lib/types";
  import InventoryStore from "./InventoryStore.svelte";

  export let users: CUser[];
  export let user: CUser;
  let isOpenedMiddlePanel:boolean = false;
  
  $: actions = Object.entries(user.actions).filter(([_,data]) => data.qntyInventory != 0);
  $: isActiveMiddlePanel = isOpenedMiddlePanel ? 'active' : '';

  function toTriggeringMiddlePanel () {
    isOpenedMiddlePanel = isOpenedMiddlePanel ? false : true;
  }
  function toActiveAction(action: string) {
    actions.forEach(([role, obj]) => {
      obj.status = (
        role === action 
        ? true 
        : false
      );
    });
    actions = [...actions];
  }

</script>

<div class="UICU __lowerPanel">
  <div class="UICU_users">
    {#each users as user}
      <div class="user {!user.isMe ? '__apponent':''} {user.isDied ? '__dead' : ''} {user.isFinished ? '__finished' : ''}">
        <img src="/imgs/characters/character_{user.idHero+1}.png" alt="">
        <div class="user-HP"  style="height:{user.HP}%;"/>
      </div>
    {/each}
  </div>

  <div class="UICU_user">
    <div class="UICU_user_actions">
      {#each actions as [role, {status, qntyInventory, isShow}]}
        {#if qntyInventory > 0 && isShow}
          <button data-qnty="{qntyInventory}x" on:click={() => toActiveAction(role)} class="UICU_user_actions_item __noEmpty {status ? "active" : ""}">
            <img src="/imgs/roles/{role}.png" alt=""/>
          </button>
        {:else if !isShow}
          <div class="UICU_user_actions_item"/>
        {/if}
      {/each}

      {#if 3 - actions.length > 0 }
        {#each {length:3 - actions.length} as _}
          <div class="UICU_user_actions_item"/>
        {/each}
      {/if}
     
    </div>
    <div class="UICU_user_HP">
      <div class="container">
        <div class="UICU_user_HP_road" style="height:{user.HP}%;"/>
        <h4>HP</h4>
      </div>
    </div>
  </div>
</div>
<div class="UICU __middlePanel {isActiveMiddlePanel}">
  <button 
    on:click={toTriggeringMiddlePanel} 
    class="UICU __middlePanel_trigger">
      <img src="/imgs/expandArrow.png" alt=""/>
    </button>
  <div class="container">
    <InventoryStore/>
  </div>
</div>
<div class="UICU __topPanel">
  <div class="UICU_money">
    <div class="UICU_money_icon">
      <img src="/imgs/money.png" alt=""/>
    </div>
    <div class="UICU_money_text">
      {user.money}
    </div>
  </div>
</div>


<style lang="scss">
  .UICU {
    transition: 0.2s ease;
    &.__lowerPanel, &.__topPanel,&.__middlePanel {
      display: flex;
      gap: 20px;
      position: absolute;
      right:20px;
      z-index: 11;
    }

    &.__middlePanel {
      right: calc(-600px + 1%);
      bottom: calc(50% - (400px /2));
      width: 600px;
      height: 400px;
      transition: 0.2s ease;
      background: rgb(var(--dark-background));
      border-bottom-left-radius: var(--rounded-md);

      .container {
        width: 100%;
        display: none;
      }

      &.active {
        right:0;

        .container {
          display: block;
          background: rgb(var(--dark-100), 1);
        }
        .UICU.__middlePanel_trigger {
          background-color: rgb(var(--dark-400));
          outline: 2px solid rgb(var(--dark-100)) ;
          img {
            transform: rotate(0deg);
            filter: none;
          }
        }

        &:before {
          content: "Магазин";
          bottom: 100%;
          padding: 5px 20px;
          background-color: rgb(var(--dark-100));
          border-top-left-radius: var(--rounded-sm);
          border-top-right-radius: var(--rounded-sm);
          position: absolute;
        }
      }

      &_trigger {
        position: absolute;
        top: calc(50% - (50px /2));
        left: -2%;
        width: 30px;
        height: 50px;
        border-radius: var(--rounded-lg);
        background-color: rgb(var(--dark-100));
        outline: 2px solid rgb(var(--dark-200));
        z-index: 99;
        img {
          width: 15px;
          transform: rotate(180deg);
          filter:  contrast(2) invert(1);
        }
      }

      
    }

    &.__lowerPanel {
      bottom: 10px;
    }

    &.__topPanel {
      align-items: center;
      top: 10px;
    }
    
    &_users {
      order:1;
      gap: 10px;
      display: flex;
      max-width: 400px;

      .user {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: var(--rounded-md);
        width: 60px;
        aspect-ratio: 2/2;
        background: rgb(var(--dark-100), 0.8);
        outline: 2px solid rgb(var(--dark-100), 0.7);
        box-shadow: inset 0 0 40px rgb(var(--dark-200));
        overflow: hidden;

        &.__apponent {
          opacity: 0.3;
        }

        &.__dead, &.__finished {
          background: rgb(var(--dark-100), 0.1);
          outline: 2px solid rgb(var(--dark-100), 0.3);

          &::before {
            display: block;
            position: absolute;
            text-transform: uppercase;
            color: rgb(var(--dark-100), 0.7);
            text-align: center;
            font-size: small;
            text-shadow: 
              2px 2px 1px rgb(var(--dark-400)), 
              -1px -1px 1px rgb(var(--dark-400));
            z-index: 10;
          }
        }
       
        &.__dead::before {content: "is dead";}
        &.__finished::before {content: "is finished";}

        &-HP {
          width: 100%;
          align-self: flex-end;
          transition: 0.2s ease;
          background-color: rgb(var(--dark-100), 0.4);
          box-shadow: 0 -1px 4px rgb(var(--dark-400));
        }
        img {
          position: absolute;
          width: 30px;
        } 
      }
    }

    &_user {
      display: flex;
      gap: 10px;
      flex-direction: row-reverse;
      height: 60px;
      
      &_actions {
        display: flex;
        &_item { 
          position: relative;
          width: 60px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgb(var(--dark-400));

          &.__noEmpty {
            cursor: pointer;
            transition: 0.2s ease;
            &:hover , &.active {
              background-color: rgb(var(--dark-100)) ;
              img {
                opacity: 1;
                filter: contrast(2) invert(1);
              }
            }
          }
          &:first-child {
            border-bottom-left-radius: var(--rounded-lg);
            border-top-left-radius: var(--rounded-lg);
          }

          &:last-child {
            border-bottom-right-radius: var(--rounded-lg);
            border-top-right-radius: var(--rounded-lg);
          }

          &:not(:last-child) {
            border-right: 2px solid rgb(var(--dark-200));
          }
    
          img {
            width: 50%;
            opacity: 0.4;
          }

          &::before {
            content: attr(data-qnty);
            display: block;
            position: absolute;
            right: 4px;
            bottom: 2px;
            font-size: small;
            font-weight: bold;
            color: rgb(var(--dark-200))
          }
        }
      }

      &_HP {
        width: 40px;
        height: 100%;
        border-radius: var(--rounded-lg);
        outline: 2px solid rgb(var(--dark-300));
        background-color: rgb(var(--dark-bg));

        .container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          padding: 4px;
          text-align: center;
        }

        H4 {
          position: absolute;
          top: 25%;
          color: rgb(var(--dark-100));
          font-weight: bold;
          font-size: large;
          text-shadow: 
            2px 2px 1px rgb(var(--dark-400)), 
            -1px -1px 1px rgb(var(--dark-400));

        }

        &_road {
          width: 100%;
          max-height: 100%;
          transition: 0.2s;
        
          background: rgb(var(--dark-100));
          border-radius: var(--rounded-md);
          box-shadow: 0 -4px 2px rgb(var(--dark-400));

        }
      }
    }

    &_money {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background-color: rgba(var(--dark-100));
      border-radius: var(--rounded-lg);
      border: 1px solid rgb(var(--dark-100), 0.3);
      padding: 5px 10px;

      &_icon {
        display: flex;
        align-items: center;
        height: 15px;

        img {
          width: 100%;
          height: 100%;
          filter: contrast(10) invert(9)   drop-shadow( 2px 2px 0 rgb(var(--dark-300)));
        }
      }

      &_text {
        font-size: x-large;
        color: rgb(var(--dark-100));
        text-shadow: 
            2px 2px 1px rgb(var(--dark-400)), 
            -1px -1px 1px rgb(var(--dark-400));
      }
    }
  }


</style>