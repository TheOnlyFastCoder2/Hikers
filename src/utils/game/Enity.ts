import toReverseDirection from "utils/toReverseDirection";
import type {CEntity, TDirect, TDirects } from "lib/types";
import { ERoles, rounded, stepCell, sizeCell  } from "utils/game/game.config";

export default class Einity {
    public x:number = 0;
    public y:number = 0;
    public index:number = 0;
    public role: ERoles|undefined;
    public prevCell:Einity|undefined;
    public featureDirection:TDirect|undefined;

    public readonly size:number = sizeCell;
    public readonly step:number = stepCell;
    public readonly rounded: number = rounded;

    constructor(data?:CEntity) {
      Object.assign(this, data)
    } 
    
    public readonly directions = {
      existing: ['RIGHT','LEFT','TOP','BOTTOM'] as TDirects,
      removed: [] as TDirects,
    };
    
    setPosition (x: number, y:number): Einity  {
      this.x = x;
      this.y = y;
      return this;
    }

    setFeatureDirection(direct:TDirect) {
      this.featureDirection = direct;
    }

    private toRemoveOrAddDirection (
      direct: TDirect, 
      toFrom: keyof Einity["directions"], 
      toIn: keyof Einity["directions"] 
    ) {
      const index =  this.directions[toFrom].indexOf(direct);
      this.directions[toFrom].splice(index, 1);
      this.directions[toIn].push(direct);
    }

    toRemoveDirection(direct: TDirect) {
      this.toRemoveOrAddDirection(
        direct, 'existing', 'removed'
      );
    }

    toAddDirection(direct: TDirect) {
      this.toRemoveOrAddDirection(
        direct, 'removed', 'existing'
      );
    }


    removeSelf(): Einity {
      if(this.prevCell) {
        [...this.prevCell.directions.removed].forEach((item) => {
          if(item && this.prevCell?.prevCell === undefined) {
            this.prevCell?.toAddDirection(item);
          } else if (item && this.prevCell?.prevCell?.featureDirection !== toReverseDirection(item)) {
            this.prevCell?.toAddDirection(item);
          }
        })
        this.prevCell.featureDirection = undefined;
      }
      return this;
    }

    createCell (direct:TDirect, prevCell: Einity): Einity  {
      if(direct === 'RIGHT' || direct === 'LEFT') {
        this.y = prevCell.y;
        this.x = (
          direct === 'RIGHT' 
          ? prevCell.x+this.size+this.step 
          : prevCell.x-this.size-this.step
        );
        
      } else if(direct === 'BOTTOM' || direct === 'TOP') {
        this.x = prevCell.x;
        this.y = (
          direct === 'BOTTOM' 
          ? prevCell.y+this.size+this.step 
          : prevCell.y-this.size-this.step
        );
      }

      this.prevCell = prevCell;
      this.index = prevCell.index + 1;
      prevCell.toRemoveDirection('TOP');
      prevCell.toRemoveDirection('LEFT');
      prevCell.toRemoveDirection('BOTTOM');
      prevCell.toRemoveDirection('RIGHT');
      prevCell.setFeatureDirection(direct)
      this.toRemoveDirection(toReverseDirection(direct));
      return this;
    }
  
}
