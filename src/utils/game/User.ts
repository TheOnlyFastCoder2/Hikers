import type { ERoles } from "./game.config";
import type { TUserDataAction } from "lib/types";

export default class User {
  public x:number = 0;
  public y:number = 0;
  public HP:number = 100;
  public indCell = 0;
  public money = 50;
  public finalRank:number = 0;

  public isDied = false;
  public isFinished = false;
  public isStartPorted:boolean = false;
  public isPorted:boolean = false;

  public idHero:number = 0;
  public isMe:boolean = false;
  public name:string|undefined;
  public actions: Partial<Record<ERoles, TUserDataAction>> = {};

  public setIsMe(val:boolean = true): User {
    this.isMe = val;
    return this;
  }

  public setPosition(x:number, y:number): User {
    this.x = x;
    this.y = y;
    return this;
  }

  public setCharacter(idHero:number): User {
    this.idHero = idHero;
    return this;
  }

  public setName(nameHero:string): User {
    this.name = nameHero;
    return this;
  }
  
  public setIndCell(index:number) {
    this.indCell = index;
    return this;
  }
} 