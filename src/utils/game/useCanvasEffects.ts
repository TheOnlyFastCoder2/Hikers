import { loadSprite, drawSpriteAnimation } from "lib/canvas";
import type { CUser, IPos, TCBAction } from "lib/types";
import { ERoles, sizeCell } from "./game.config";
import spArrowOfBow from 'assets/sprites/arrowOfBow.png';
import spBomb from 'assets/sprites/bomb.png';
import RequesAnimation from "utils/RequestAnimation";

import { Vec2 } from "@vicimpa/lib-vec2";
import type Einity from "./Enity";
import toReverseDirection from "utils/toReverseDirection";



export interface IMethods {
  toMove: (x:number, y:number, zoom:number) => void
}

interface IMethodsArgs extends IMethods {
  toCentered:(pos:IPos) => IPos,
}

const frame = new RequesAnimation();
const frameAnim = new RequesAnimation();
export type TReturn = Partial<Record<ERoles , (user:CUser, apponent?:CUser, cb?:TCBAction, getRoad?:(range?: [number, number]) => Einity[]) => void> & IMethods>;

export default function useCanvasEffects (methods:IMethodsArgs, ctx:CanvasRenderingContext2D, ctxSpriteAnim:CanvasRenderingContext2D ): TReturn {
  const cbs:Array<(removeSelf:Function) => void> = new Array();
  const cbsAnimation:Array<(removeSelf:(trigger: boolean) => void) => void> = new Array();
 
  frame.init(0.005, () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    cbs
    .forEach((cb, index) => {
      cb(() => {
        cbs.splice(index, 1);
        frame.cancelFrameAnimation();
      })
    });
  });

  frameAnim.init(0.09, () => {
    ctxSpriteAnim.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    cbsAnimation
    .forEach((cb, index) => {
      cb((trigger) => {
        if(trigger) {
          cbsAnimation.splice(index, 1);
          frameAnim.cancelFrameAnimation();
        }
      })
    });
  })



  return {
    toMove: methods.toMove,
    [ERoles.BOW]: (user:CUser, apponent?:CUser , cb?: Function, getRoad?:(range?: [number, number]) => Einity[]) => {
      apponent = apponent!;
      cb = cb!;

      const directRoad = apponent.indCell - user.indCell > 0 ? 1 : -1;
      const road = getRoad!((
        directRoad === 1 
        ? [user.indCell, apponent.indCell]
        : [apponent.indCell, user.indCell]
      ));

      let cell = directRoad === 1 ? 0 : road.length-1;
        

      const w = 60, h = 60;
      const bow = new Vec2(user);

      const spriteBow = loadSprite(spArrowOfBow);
     
      let angle = 0;
      let isDamage = false;
      let velocity = 15;
      let nextCell = road[cell];

      frame.toStartFrame();
      frameAnim.toStartFrame();
      
      cbs.push((removeSelf) => {
        nextCell = road[cell];
        velocity += 0.02;
        const d = directRoad !== 1 ? toReverseDirection(nextCell.featureDirection!) : nextCell.featureDirection;
        switch(d) {
            case 'RIGHT': {
              bow.x += velocity;
              angle = 0; break;
            }
            case 'TOP': {
              bow.y -= velocity;
              angle = -90; break;
            }
            case 'LEFT': {
              bow.x -= velocity;
              angle = 180; break;
            }
            case 'BOTTOM': {
              bow.y += velocity;
              angle = 90; break;
            }
          }
          
          if(
            directRoad === 1 && (
              d === 'RIGHT' && bow.x-h>= nextCell.x ||
              d === 'LEFT' && bow.x+w <= nextCell.x ||
              d === 'TOP' && bow.y+h <= nextCell.y ||
              d === 'BOTTOM' && bow.y-h >= nextCell.y
            ) ||
            directRoad === -1 && (
              d === 'RIGHT' && bow.x>= nextCell.x ||
              d === 'LEFT' && bow.x <= nextCell.x ||
              d === 'TOP' && bow.y <= nextCell.y ||
              d === 'BOTTOM' && bow.y >= nextCell.y
            )
          ) {
            if(road[cell + 1 * directRoad])
              cell = cell + 1 * directRoad
          }

          const pos = methods.toCentered(bow);
          drawSpriteAnimation(
            ctx, 
            pos.x,
            pos.y, w, h,
            spriteBow, 0, 0, angle
          )

          if(!isDamage) {
            if(bow.distance(apponent) <= sizeCell) {
              cb(); 
              isDamage = true; 
            }
            
          } else removeSelf()
          
      });
    },
    [ERoles.POISON]: (user:IPos, apponent?:IPos, cb?: Function) => {
      cb = cb!;
      cb();
    },
    [ERoles.POTION]: (user:IPos, apponent?:IPos, cb?: Function) => {
      cb = cb!;
      cb();
    },
    [ERoles.SWORD]: (user:IPos, apponent?:IPos, cb?: Function) => {
      // apponent = apponent!;
      cb = cb!;
      cb();
    },

    [ERoles.BOMB]: (user:IPos) => {
      frameAnim.toStartFrame();

      let i = 0;
      const spriteBomb = loadSprite(spBomb); 
      
      cbsAnimation.push((removeSelf) => {
        const pos = methods.toCentered(user);
        drawSpriteAnimation(
          ctxSpriteAnim, 
          pos.x-(208-sizeCell*2.2), pos.y-(208 - sizeCell), 208, 208,
          spriteBomb, i++
        )
        removeSelf(i > 6);
      });

    }, 
  }
}
