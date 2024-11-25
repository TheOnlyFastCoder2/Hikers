<script lang="ts">
  import type { TPage } from "lib/types";
  import stPage from "store/stPage";

  export let to:TPage;
  export let justify:'START'|'CENTER'|'END' = 'START';
  export let align: 'START'|'CENTER'|'END' = 'START'; 
  export let onclick:(() => boolean)|undefined = undefined;

  export function _setPage () {
    stPage.setPage(to);
  }

  function setPage() {
    if(onclick === undefined) {
      stPage.setPage(to);
    } else if (onclick()) {
      stPage.setPage(to)
    }
  }
</script>

<button class="Linker __justify-{justify} __align-{align}" on:click={setPage}>
  <slot/>
</button>

<style lang="scss">
  .Linker {
    &.__justify-START {
      justify-self: start;
      margin-right: 0;
    }
    &.__justify-CENTER {
      justify-self: center;
      margin-left: auto;
      margin-right: auto;
    }
    &.__justify-END {
      align-self: end;
      margin-left: auto;
    }

    &.__align-START {
      align-self: start;
      margin-top: 0;
    }
    &.__align-CENTER {
      align-self: center;
      margin-top: auto;
      margin-bottom: auto;
    }
    &.__align-END {
      align-self: end;
      margin-top: auto;
    }
  }
</style>