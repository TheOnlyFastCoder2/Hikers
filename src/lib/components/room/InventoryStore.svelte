<script lang="ts">
  import type { IInventoryStore } from "lib/types";
  import { ERoles, InventoryStore } from "utils/game/game.config";
  import stUsers from "store/user/stUsers";
  import audioMoney from "assets/audio/moneys.mp3";
  import playAudio from "utils/PlayerAudio";
  import SVGDelte from "assets/svg/SVGDelte.svelte";
  import SVGAdd from "assets/svg/SVGAdd.svelte";

  const products: {totalPrice:number, data: Partial<Record<ERoles, {price:number, qnty: number}>>} = {
    totalPrice: 0,
    data: {}
  };

  function increment(role: string, data: IInventoryStore) {
    products.totalPrice += data.price;
    products.data[role as ERoles] = {
      price: data.price,
      qnty: (
        products.data[role as ERoles] !== undefined
        ? products.data[role as ERoles]!.qnty + 1
        : 1
      )
    }
  }

  function decrement(role: string, data: IInventoryStore) {
    const {totalPrice} = products;
    const product = products.data[role as ERoles];
    if(product&& product.qnty - 1 < 1) {
      delete products.data[role as ERoles]
    }
    if(product !== undefined) {
      product.qnty = product.qnty - 1;
      products.totalPrice = (
        totalPrice - data.price < 0 
        ? 0 
        : totalPrice - data.price
      );
    } 

 
  }

  function toBuyProducts() {
    const user = stUsers.getActiveUser()!;
    Object.entries(products.data).forEach(([key, data]) => {
      const role = key as ERoles;
      if(user && user.money - data.qnty * data.price >= 0) {
        if(user.actions[role] === undefined) {
          user.actions[role] = {
            status: false,
            isShow: true,
            apponents: [],
            qntyBuffs: 0,
            qntyInventory: data.qnty,
          }
          delete products.data[role];
          user.money -= data.qnty * data.price;
          products.totalPrice -= data.qnty * data.price;
          stUsers.reload();
        } else {
          user.actions[role].qntyInventory += data.qnty;
          user.money -= data.qnty * data.price;
          products.totalPrice -= data.qnty * data.price;
          stUsers.reload();
          delete products.data[role];
        }
        playAudio(audioMoney);
      }
        
    });
  }

</script>

<div class="Store">
  <div class="container">
    {#each Object.entries(InventoryStore) as [role, data]}
        <div class="product" 
          data-name={data.name} 
          data-description={data.description}>
          <div class="product_icon">
            <img src="/imgs/roles/{role}.png" alt="">
          </div>
          <div class="product_price">
            <div class="product_price_icon">
              <img src="/imgs/money.png" alt=""/>
            </div>
            <span>{data.price}</span>
          </div>
          <div class="product_panel">
            <button class="product_panel_btn" on:click={() => increment(role, data)}><SVGAdd/></button>
            <button class="product_panel_btn" on:click={() => decrement(role, data)}><SVGDelte/></button>
          </div>
        </div>
    {/each}
  </div>

  <div class="Store_lowerPanel">
    <div class="Store_lowerPanel_products">
      {#each Object.entries(products.data) as  [role, data]}
        <div class="product" data-qnty="{data.qnty}x">
          <div class="product_icon">
            <img src="/imgs/roles/{role}.png" alt="">
          </div>
        </div>
      {/each}
    </div>
    <div class="Store_lowerPanel_price">
      <div class="Store_lowerPanel_price_icon">
        <img src="/imgs/money.png" alt=""/>
      </div>
      <span>{products.totalPrice}</span>
    </div>
    <button class="Store_lowerPanel_btn" on:click={toBuyProducts}>
      купить 
    </button>
  </div>
</div>

<style lang="scss">
  .Store {
    position: relative;
    
    width: calc(100% - 10px);
    height: calc(100% - 20px);
    margin: 10px;
    margin-right: 0;
    overflow-x: hidden;

    &:hover {
      overflow-x:visible;
    }
    .container {
      width: 100%;
      height: calc(100% - 60px);
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding: 20px;
      box-shadow: inset 0 0 10px 3px rgb(var(--dark-400), 0.1);
    }

    .container  .product {
      display: flex;
      flex-direction: column;
      width: 60px;
      height: 90px;
      background-color: rgb(var(--dark-100));
      outline: 4px solid rgb(var(--dark-400));
      border-radius: var(--rounded-md);
      img {
        transition: 0.2s ease;
      }

      &:hover {
        .product_price {gap: 6px;}
        img, .product_price span {
            transform: scale(1.3);
        }

        &:before, &:after {
          opacity: 1;
        }
      }

      &_price {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 3px;
        padding: 4px 10px;
        font-size: smaller;
        background-color: rgb(var(--dark-400));
        color: rgb(var(--dark-100), 0.6);
        &_icon {
          display: flex;
          align-items: center;
          height: 10px;

          img {
            width: 100%;
            height: 100%;
          
          }
        }
      }

      &_icon {
        display:flex;
        justify-content: center;
        align-items: center;
        width: 55%;
        margin: 0 auto;
        aspect-ratio: 2/2;
        margin-top: auto;
        margin-bottom: auto;
     
        img {
          width: 80%;
          filter: contrast(10) invert(1)
        }
      }

      &_panel {
        display:flex;
        background: rgb(var(--dark-400));
        
        &_btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50%;
          padding: 5px 10px;
          height: 100%;
          
          &:active {
            background: rgb(var(--dark-100));
            svg {
              fill: rgb(var(--dark-400));
            }
          }
        }
      }


      &:before, &:after {
        position: absolute;
        right: calc(100% + 40px);
        width: 300px;
       
        transition-delay: 0.5s;
        opacity: 0;
      }

      &:after {
        content: attr(data-name);
        display: grid;
        place-content: center;
        top:0;
        height: 40px;
        font-size: larger;
        color:  rgb(var(--dark-400));
        background-color: rgb(var(--dark-100));
        border-top-left-radius: var(--rounded-md);
        border-top-right-radius: var(--rounded-md);
      }

      &:before {
        content: attr(data-description);
        bottom: 0;
        width: calc(300px - 20px);
        height: calc(100% - 40px - 20px);
        padding: 10px;
        font-size: large;
        letter-spacing: 0.5px;
        color:  rgb(var(--dark-100), 0.8);
        border-bottom-left-radius: var(--rounded-md);
        border-bottom-right-radius: var(--rounded-md);
        background-color: rgb(var(--dark-400));
        box-shadow: inset 0 0 3px rgb(var(--dark-100));
      }
    }

    &_lowerPanel {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      width: 100%;
      height: 60px;
      padding: 10px;
      background: rgb(var(--dark-400));

      &_products {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        position: relative;
        padding: 0 10px;
        height: calc(100% + 20px);
        top: -20px;
        background: rgb(var(--dark-100));
        border-radius: var(--rounded-md);
        outline: 4px solid rgb(var(--dark-400));
        
        .product {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          width: 40px;
          height: 40px;
          padding: 10px;
          outline: 4px solid rgb(var(--dark-400));
          border-radius: var(--rounded-md);

          &:before {
            content: attr(data-qnty);
            position: absolute;
            bottom: 2px;
            right: 2px;
            color: rgb(var(--dark-400));
            font-size: small;

          }
          img {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
            top: -2px;
            filter: contrast(10) invert(1);
          }
        }
      }

      &_price {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 3px;
        height: 100%;
        padding: 0 20px;
        font-size: x-large;
        background-color: rgb(var(--dark-100));
        color: rgb(var(--dark-400));
        border-radius: var(--rounded-sm);

        &_icon {
          display: flex;
          align-items: center;
          width: 10px;
          height: 15px;

          img {
            width: 100%;
            height: 100%;
            filter: contrast(10) invert(1);
          }
        }
      }

      &_btn {
        height: 100%;
        padding: 0 20px;
        font-size: large;
        border-radius: var(--rounded-sm);
        background: rgb(var(--dark-100));
      }
    }
  }
</style>