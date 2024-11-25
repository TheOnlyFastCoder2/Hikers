<script lang="ts">
  import type { CUser } from "lib/types";
  import Notification from "lib/ul/Notification.svelte";
  import stUsers from "store/user/stUsers";
  import User from "utils/game/User";
  

  let inputVal:string;
  let indUser:number|undefined;
  let indHero:number|undefined;
  let users = new Array<CUser|null>(null);
  let notification: Notification;

  function reloadUsers() {
    stUsers.reset();
    users.forEach((user) => {
      if(user !== null) {
        stUsers.addUser(user);
      }
    })
    users = [...users];
  }
  function checkNickName() {
    let returnValue = true;
    users.forEach((user, index) => {
      if(user?.name === inputVal && indUser !== index) {
        notification.toOpen();
        returnValue = false;
      }
    });
    return returnValue;
  }
  function setHero(index:number) {
    if(inputVal !== undefined && inputVal.length >= 1) {
      const indEmptyCell = users.indexOf(null);

      if(indEmptyCell != -1) {
        if(checkNickName()) {
          indHero = index;
          users[indEmptyCell] = (
            new User()
              .setIsMe()
              .setCharacter(index)
              .setName(inputVal)
          );
          reloadUsers();
        }
      
      }
      if(indUser !== undefined) { 
        if(checkNickName()) {
          indHero = index;
          users[indUser] = (
            new User()
              .setIsMe()
              .setCharacter(index)
              .setName(inputVal)
          );
          reloadUsers();
        }
      }
    }
  }
  
  function setActiveUser(index:number) {
    if(users.indexOf(null) === -1) {
      indUser = index;
      indHero = users[index]!.idHero;
      inputVal = users[index]!.name!;
    }
  }

  function addEmptyCell(index:number) {
    indUser = undefined;
    indHero = undefined;
    inputVal = '';

    users.length > 1
    ? users.splice(index+1, index-1, null)
    : users.push(null);


    reloadUsers();
  }

  function removeUser(index:number) {
    users.splice(index, 1);
    indHero = undefined;
    reloadUsers();
  }

  function changeName() {
    if(indUser !== undefined && inputVal.length > 0) {
      users[indUser]!.name = inputVal;
    }
  }

</script>


<Notification
  width={400}
  height={150}
  topic={"⚠️ Предупреждение"}
  description={"Стаким никнейном пользователь уже существует :)"}
  bind:this={notification}
/>
<div class="StoreOfCharacters">
  <h1>персонажи</h1>
  <div class="container __items">
    {#each {length: 22} as _,i}
      <button on:click={() => setHero(i)} class="StoreOfCharacters_item {
          indHero === i ? 'active' : '' 
        }">
        <img src="/imgs/characters/character_{i+1}.png" alt=""> 
      </button>
    {/each}
  </div>
  <input 
    bind:value={inputVal}
    on:change={changeName} 
    type="text"
    class="StoreOfCharacters_input"
    placeholder="напиши свой ник..."/>
  <div class="StoreOfCharacters_createdUsers">
    {#each users as user,index}
      {#if user === null}
        <button class="user __none">
          <h1>?</h1>
          {#if users.length > 1}
            <button class="user_remover" on:click={() => removeUser(index)}>-</button>
          {/if}
        </button>
      {:else}
        <button 
          on:mouseenter={() => setActiveUser(index)} 
          class="user {index === indUser ? '__active': ''}">

          <button class="user_remover" on:click={() => removeUser(index)}>-</button>
          <button class="user_creater" on:click={() => addEmptyCell(index)}>+</button>
          <div class="user_avatar">
            <img src="/imgs/characters/character_{user.idHero+1}.png" alt=""/>
          </div>
          <div class="user_panel">
            <p>{user.name}</p>
          </div> 
        </button>
      {/if} 
    {/each}
    
  </div>
</div>

<style lang="scss">
  .StoreOfCharacters {
    width: 500px;
    text-align: center;
    justify-content: flex-end;
    border: 1px solid rgb(var(--dark-300));
    &_createdUsers {
      display: flex;
      align-items: center;
      gap: 10px;
   
      $size: 90px;
      height: $size;
      overflow-x: auto;
      
      .user {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: $size;
        height: $size;
        background: rgb(var(--dark-300));
        opacity: 0.4;
        
        &.__active {
          opacity: 1;
        }

        &.__none {
          justify-content: center;
          align-items: center;
          h1 {
            color:rgb(var(--dark-400));
            text-shadow: none;
          }

          .user_remover {
            top:0;
            width: 25px;
            height: 25px;
            left: calc(100% - 25px)
          }
        }

        &_creater {right: 0px;}
        &_remover {left: 0px;}

        &_creater, &_remover {
          text-align: center;
          align-content: center;
          position: absolute;
          top: calc(50% - 20px);
          width: 20px;
          height: 20px;
          color: rgb(var(--dark-400));
          background: rgb(var(--dark-100));
          border: 1px solid rgb(var(--dark-400));
          font-weight: bolder;
          font-size: large;
          pointer-events: none;
          transition: 0.1s;
          opacity: 0;
          &:active ,&:hover {
            color: rgb(var(--dark-100));
            background: rgb(var(--dark-300));
            border: 1px solid rgb(var(--dark-100));
          }
        }

        &:hover {
          .user_creater, .user_remover {
            opacity: 1;
            pointer-events: all;
          }
        }
        &_avatar {
          text-align: center;
          align-content: center;
          width: 100%;
          height: calc(100% - 30px);
          background: rgb(var(--dark-100));
          img {
            height: 70%;
          } 
        }

        &_panel {
          text-align: center;
          align-content: center;
          width: 100%;
          height: 30px;
          background: rgb(var(--dark-100));
          color: rgb(var(--dark-400));
          border-top: 2px solid rgb(var(--dark-400));
        }
      }
    }

   h1 {
      padding: 20px 0;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 50px;
      letter-spacing: 0.8px;
      color: rgb(var(--dark-100, 0.6));
      text-shadow: -5px 5px rgb(var(--dark-200));
      padding:20px;
    } 

    .container.__items {
      display: grid;
      grid-template-columns: repeat(5, minmax(45px, 1fr));
      gap: 1px;
      width: 100%;
      height: 300px;
      overflow-y: scroll;
    }
    
    &_item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      background: rgb(var(--dark-200));
      cursor: pointer;
      padding: 10px;
      img {
        width: 40px;
        transition: 0.2s ease;
        transition-delay: 0.2s;
      }
      &:hover, &.active {
        background: rgb(var(--dark-100));
        img {
          transform: scale(1.1);
        }
      }
    }

    &_input {
      border-radius: var(--rounded-sm);
      border-top: 1px solid rgb(var(--dark-300));
      border-bottom: 1px solid rgb(var(--dark-300));
      padding: 20px 10px;
      color: rgb(var(--dark-200));
      font-size: large;
      letter-spacing: 1px;
      text-transform: uppercase;
      width: 100%;
      &::placeholder {
        color: rgb(var(--dark-200));
        text-transform: capitalize;
      }
      &:focus-visible, &:focus {
        color: rgb(var(--dark-100));
      }
    }

    &_btn {
      display:block;
      padding: 10px 20px;
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
</style>