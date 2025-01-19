import type User from "utils/game/User";
import Einity from "../utils/game/Enity";

export type CUser = User;
export type CEntity = Einity;
export type TMode = 'ADD'|'REMOVE';
export type TPage = 'START'|'CONSTRUCTOR'|'ROOM_OFFLINE'|'ROOM_ONLINE';
export type TDirects = ['RIGHT'?,'LEFT'?,'TOP'?,'BOTTOM'?];
export type TDirect = 'RIGHT'|'LEFT'|'BOTTOM'|'TOP';

export type TUserAction = (user:CUser, cell:CEntity, currStep:number, timeID: NodeJS.Timeout, map:CEntity[]) => void;
export type TCBAction = (apponent?: CUser, cbDamageEffect?:Function) => void|boolean;
export type TUserDataAction = {cb?:TCBAction, status:boolean, qntyBuffs: number, qntyInventory:number, isShow:boolean, apponents:Function[]};

export interface IPos {
  x: number,
  y: number,
}

export interface ICell extends IPos {
  directions: {
    existing:TDirects
    removed:TDirects,
  }
}

export interface ISize {
  width:number,
  height:number,
}

export interface IDataOfRole {
  name: string,
  value: number,
  rangeBuffs?: number,
  rangeSteps: number,
  description: string,
}

export interface IInventoryStore {
  name: string,
  price: number;
  description: string,
}