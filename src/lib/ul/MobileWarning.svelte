<div class="MobileWarning">
  <h1>
    Прости, игра для разрешения мониторов <span>850x550</span> и выше.
  </h1>
</div>

<style lang="scss">
  .MobileWarning {
    position: absolute;
    top:0;left:0;
    width: 100vw;
    height: 100vh;
    background-color: rgb(var(--dark-bg));
    display:none;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    padding: 20px;
    
    h1 {
      max-width: min(900px, 90%);
      font-size: 60px;
      color: rgb(var(--dark-200));
      text-wrap: pretty;
      text-align: center;
      span {
        color: rgb(var(--dark-100));
      }
    }

    @media screen and (max-width: 1024px) , (max-height: 768px) {
      display: flex;
    }
  }
</style>