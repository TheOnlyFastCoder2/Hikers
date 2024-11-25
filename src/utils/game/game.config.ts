// import { ERoles } from "./types";

import type { IDataOfRole, IInventoryStore, ISize } from "../../lib/types";

export const sizeCell:number = 60;
export const stepCell:number = 10;
export const stepBtn:number = 10;
export const rounded: number = 4;
export const stepCamera:number = 20;
export const stepZoomCamera:number = 0.01;

interface IScaler extends ISize {
  offsetX: number, 
  offsetY:number
}
export const scaler:IScaler  = {
  width: 150, height: 50,
  offsetX: 10, offsetY: 10,
}

export enum ERoles {
  BOMB = 'BOMB',
  BOW = 'BOW',
  HANDCUFFS = 'HANDCUFFS',
  MONEY = 'MONEY',
  SWORD = 'SWORD',
  POTION = 'POTION',
  POISON = 'POISON',
  NEXT = 'NEXT',
  PORTAL = 'PORTAL',
}

export const DataOfRoles: Readonly<Record<ERoles,Readonly<IDataOfRole>>> = {
  [ERoles.BOMB]:  {
    name: 'Бомба',
    value: 12,
    rangeSteps:4,
    description: 'Домажит пользователя на 12 едениц с расстояния 4 клеток',
  },
  [ERoles.BOW]:  {
    name: 'лук',
    value: 23,
    rangeSteps: 90,
    description: 'Домажит пользователя на 23 едениц с расстояния 20 клеток',
  },
  [ERoles.HANDCUFFS]:  {
    name: 'Наручники',
    value: 1,
    rangeSteps: 0,
    description: 'Сковывает пользователя на один ход',
  },
  [ERoles.MONEY]:  {
    name: 'деньги',
    value: 100,
    rangeSteps: 0,
    description: `
      Пользователь получает +100 монет.
      Если догонишиь противника: +5 монет.
      За каждый домаг из лука: +10 монет.
      За каждый домаг от меча: +15 монет.
      За каждый домаг от яда: +6 монет.
      За каждое убийство: +20 монет.
    `,
  },
  [ERoles.SWORD]:  {
    name: 'Меч', 
    value: 10,
    rangeSteps: 2,
    description: 'Домажит пользователя на 10 едениц с расстояния 2 клеток',
  },
  [ERoles.POISON]: {
    name: 'Яд',
    value: 10,
    rangeBuffs: 5,
    rangeSteps: 3,
    description: 'домажит пользователя на 5 едениц здаровья на расстоянии 3 клеток '
  },
  [ERoles.POTION]: {
    name: 'Зелье здоровья',
    value: 32,
    rangeBuffs: 5,
    rangeSteps: Infinity,
    description: 'Зелье - увеличивает здоровье на 32 еденицы'
  },
  [ERoles.NEXT]: {
    name: 'Следующий шаг',
    value: 1,
    rangeSteps: 0,
    description: 'Позволяет сходить еще один раз'
  },
  [ERoles.PORTAL]: {
    name: 'Телепорт',
    value: 0,
    rangeSteps: 11,
    description: 'Тлепортирует вас на 11 клток вперед или на 5 клеток назад'
  }
}

export const InventoryStore: Readonly<Partial<Record<ERoles,Readonly<IInventoryStore>>>> = {
  [ERoles.SWORD]:  {
    price: 15,
    name: DataOfRoles.SWORD.name,
    description: DataOfRoles.SWORD.description,
  },
  [ERoles.BOW]:  {
    price: 25,
    name: DataOfRoles.BOW.name,
    description: DataOfRoles.BOW.description,
  },
  [ERoles.POTION]:  {
    price: 40,
    name: DataOfRoles.POTION.name,
    description: DataOfRoles.POTION.description,
  },

  [ERoles.POISON]: {
    price: 20,
    name: DataOfRoles.POISON.name,
    description: DataOfRoles.POISON.description
  },
}
