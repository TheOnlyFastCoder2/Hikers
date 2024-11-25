<script lang="ts">
  import { onDestroy } from 'svelte';
  import FinishAnimation from 'utils/FinishAnimation';
  import RequesAnimation from 'utils/RequestAnimation';
  import AudtioFinished from 'assets/audio/finished.mp3';
  import playAudio from 'utils/PlayerAudio';
  import type {CUser} from 'lib/types';
  
  let user: CUser;
  let frame: RequesAnimation;
  let canvas: HTMLCanvasElement;
  let animation: FinishAnimation;
  let isShow: boolean = false;

  $: if (isShow && canvas) {
    start();
  }
  onDestroy(() => {
    frame?.cancelFrameAnimation();
  });

  function start() {
    frame = new RequesAnimation();
    animation = new FinishAnimation(
      canvas.getContext('2d')!, 100, 20, 40
    );

    animation.colorArray = [
      'rgb(83, 83, 110, 1)',
      'rgb(166, 171, 239, 0.7)',
      'rgb(64, 64, 81, 0.8)'
    ];

    frame.init(0.005, () => {
      animation.animate();
    });

    frame.toStartFrame();
    animation.resize(innerWidth, innerHeight-80);
    playAudio(AudtioFinished);
  }

  export function toOpen (actUser: CUser) {
    user = actUser;
    isShow = true;
  }

  export function toClose() {
    isShow = false;
    frame?.cancelFrameAnimation();
  }
</script>

<svelte:window on:resize={() => {
  animation.resize(innerWidth, innerHeight-80)
}} on:mousemove={(e) => {
  animation?.handleMouseMove({x:e.clientX, y:e.clientY})
}}/>

{#if isShow}
  <div class="Finish">
    <canvas bind:this={canvas}/>
    <div class="wrapper">
      <h1>Вы финишировали №{user.finalRank}</h1>
      <!-- <div class="user">
        <div class="user_picture">
          <img src="/imgs/characters/character_{user.idHero+1}.png" alt="">
        </div>
        <div class="user_nickname">
          <span>{user.name}</span>
        </div>
      </div> -->
      <button class="button" on:click={toClose}>закрыть</button>
    </div>
  </div>
{/if}


<style lang="scss">
  .Finish {
    position: absolute;
    background: rgb(var(--dark-400), 0.2);
    backdrop-filter: blur(2px);
 
    font-size: clamp(20px,5vw,55px);
    text-shadow: -10px 10px rgb(var(--dark-200), 0.3), 0px 0px rgb(var(--dark-200), 1);
    z-index: 999;
    user-select: none;
    // cursor: none;

    h1 {
      color: rgb(var(--dark-100), 0.7);
    }

    .user {
      width: 100px;
      height: 100px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      border-radius: var(--rounded-md);
      background-color: rgb(var(--dark-400));
      outline: 4px solid rgb(var(--dark-400));
      $size: 25px;
      &_picture {
        width: 100%;
        height: calc(100% - #{$size});
        display: grid;
        place-items: center;
        background-color: rgb(var(--dark-100));
        img {
          width: 40%;
          // height: 100%;
        }
      }

      &_nickname {
        width: 100%;
        height: $size;
        font-size: medium;
        text-align: center;
        align-content: center;
        background-color: rgb(var(--dark-100));
        color: rgb(var(--dark-400), 1); 
        text-shadow: none;
      }
    }
    &, & > .wrapper  {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      gap: 80px;

      button {
        position: relative;
        padding: 20px 80px;
        font-size: x-large;

        &:hover {
          color: rgb(var(--dark-button));
          &::before {
            opacity: 1;
          }
        }

        &::before {
          content: "уверены ? Да.";
          display: block;
          position: absolute;
          top:0; left:0;
          width: 100%;
          height: 100%;
          text-align: center;
          align-content: center;
          opacity: 0;
          color: rgb(var(--dark-400));
        }
      }
  }

  & > .wrapper{
    position: relative;
    animation: finished 1s ease-in-out;
    @keyframes finished {
      0% {
        opacity: 0;
        transform: scale(0.2);
      }
    }
  }
  h1 {
    z-index: 99;
  }
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
  }
    
  }
</style>