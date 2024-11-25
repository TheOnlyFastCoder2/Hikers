<script lang="ts">
  import * as gameConfig from 'utils/game/game.config';
  import type { CUser } from 'lib/types';
  import stUsers from 'store/user/stUsers';
  import playAudio from 'utils/PlayerAudio';
  import audioHit from "assets/audio/hit.mp3";
  import audioDeath from "assets/audio/death.mp3";
  import audioMoney from "assets/audio/moneys.mp3";

  import { onDestroy } from 'svelte';
  import  * as userActions from 'utils/game/userActions';
  import stCanvasEffects from 'store/stCanvasEffects';
  import stCells from 'store/stCells';
  import { DataOfRoles } from 'utils/game/game.config';

  export let cell:CUser;
  export let user:CUser;
  export let indFinishCell:number;
  export let toFinished:Function;

  let timeID:NodeJS.Timeout;
  let isDamage: boolean = false;

  onDestroy(() => {
    isDamage = false;
    if( cell.HP <= 0  && user) {
      cell.isDied = true;
      user.money += 20;
      stUsers.reload();
      
      const {isAllDeads} = stUsers.checkIsAllDeadOrFinished()
      if(isAllDeads) {
        stUsers.setRank(user);
        toFinished(user)
      }
      
      playAudio(audioMoney);
      playAudio(audioDeath);
    }
    
    clearTimeout(timeID);
  });

  function toDamgeEffect() {
    playAudio(audioHit)
    isDamage = true;

    timeID = setTimeout(() => {
      isDamage = false;
      clearTimeout(timeID);
    }, 300);
  }

  function toDoAction() {
    if(cell.isMe === false) {
      let cb;
      const canvasMethods = stCanvasEffects.getMethods();
      user && Object.entries(user.actions).forEach(([role, data]) => {
        const rangeSteps = DataOfRoles[(role as gameConfig.ERoles)].rangeSteps;
        if (data.status && Math.abs(cell.indCell - user.indCell) <= rangeSteps) {
          const canvasMethod = canvasMethods[role as gameConfig.ERoles];
          if(cb = data.cb || userActions.cbUserActions[role as gameConfig.ERoles]({user})) {
            canvasMethod!(user, cell, cb.bind(null, cell, toDamgeEffect), stCells.getMap);
          }
        }
      })
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<g class={`User 
  ${isDamage ? '__damage': ''} 
  ${!cell.isMe ? '__apponent':''} 
  ${cell.isStartPorted ? '__startPorted': ''}
  ${cell.isPorted ? '__ported': ''}
  ${(!cell.isMe && !cell.isDied) && (user.x == cell.x && user.y == cell.y) ? '__hidden' : ''}
  ${cell.indCell === 0 || indFinishCell === cell.indCell ? '__opacity': ''}
  `} transform="translate({cell.x}, {cell.y})" on:click={toDoAction}>
  <rect
    width = {gameConfig.sizeCell}
    height = {gameConfig.sizeCell} 
    rx={gameConfig.rounded} ry={gameConfig.rounded}
  />
  <svg  width={gameConfig.sizeCell}  height={gameConfig.sizeCell}>
    <image 
      xlink:href="/imgs/characters/character_{cell.idHero+1}.png"   
      width={gameConfig.sizeCell/1.2}  
      height={gameConfig.sizeCell/1.2} />
  </svg>
</g>

<style lang="scss">
  .User {
    transition: 0.5s ease;
    position: relative;
    z-index: 10;

    &.__opacity {
      opacity: 0.5;
      rect {
        fill: rgb(var(--dark-300));
      }
    } 

    &.__startPorted {
      animation: ported 0.1s ease-in-out infinite;
      animation-delay: 0.5s;
      @keyframes ported {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
    &.__ported {
      transition: 0s;
      opacity: 0;
      
    }

    &.__hidden {
      opacity: 0;
    }
    rect {
      fill: rgb(var(--dark-100));
    }

    image {
      position: absolute;
      transform: translate(12%, 12%);
      user-select: none;
    }
    &.__apponent {
      cursor: pointer;
      z-index: 1;
      rect {
        fill: rgb(var(--dark-200));
      }
      &.__damage {
        position: relative;
        overflow: hidden;
        
        image {
          animation: shake 0.1s ease infinite;
          filter: drop-shadow(2px 4px 0px rgb(247, 0, 33, 0.4));
          z-index: 10;
          @keyframes shake {
            0% {opacity: 0;}
          }
        }
      }
    }

  
  }
</style>