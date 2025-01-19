import type { CEntity, CUser, TCBAction, TUserDataAction } from "lib/types";
import { DataOfRoles, ERoles } from "./game.config";
import stUsers from "store/user/stUsers";
import playAudio from "utils/PlayerAudio";
import audioHit from "assets/audio/hit.mp3";
import audioBomb from "assets/audio/bomb.mp3";
import audioMoney from "assets/audio/moneys.mp3";
import audioPickUp from "assets/audio/pickup.mp3";
import stCanvasEffects from 'store/stCanvasEffects';
import getRandomDigit from "utils/getRandomDigit";


export const increment = (value:number|undefined, step:number = 1) => {
  return value ? value + step : step
}
const decrement = (value:number , step:number = 1) => {
  return value-step < 0 ? 0 : value - step
}

const redefineData = (user:CUser, role: ERoles) => {
  return user.actions[role] = (
    user.actions[role]
    ? user.actions[role]
    : {
      isShow: false,
      status: false,
      qntyBuffs: 0, 
      qntyInventory:0,
      apponents:[],
      cb: () => {}
    }
  )
};

const cb = (user:CUser, action: ERoles, typeQnty:'qntyBuffs'|'qntyInventory') => {
  if(user.actions[action] && typeQnty in user.actions[action]) {
    user.actions[action][typeQnty] = decrement(user.actions[action][typeQnty], 1);
    stUsers.reload();

    if (user.actions[action][typeQnty] === 0) {
      user.actions[action] = undefined;
      delete user.actions[action]
    }
  }
}


export type TProps = {user:CUser, cell?:CEntity, step?:number, map?:CEntity[]};

export const cbUserActions:Record<ERoles, (props:TProps) => void|TCBAction > = {

  BOMB: ({user, cell}:TProps) => {
    const {value, rangeSteps} = DataOfRoles.BOMB;
    const canvasMethod = stCanvasEffects.getMethods()[ERoles.BOMB];
   
    canvasMethod!(user);
    playAudio(audioBomb, 0.2);
    user.HP = decrement(user.HP, value);
    stUsers.getUsers().forEach((apponent) => {
      if(Math.abs(apponent.indCell - cell!.index) <= rangeSteps) {
        apponent.HP = decrement(apponent.HP, value);
      }
    });
    stUsers.reload();
  },

  BOW: ({user}:TProps) => {
      return user.actions.BOW!.cb = (apponent?: CUser, cbDamageEffect?:Function) => {
        apponent = apponent!;
        const {value, rangeSteps} = DataOfRoles.BOW;
        if(Math.abs(apponent.indCell - user.indCell) <= rangeSteps) {
          apponent.HP = decrement(apponent.HP, value);
          cb(user, ERoles.BOW, 'qntyInventory');
          cbDamageEffect!();
          cbUserActions.MONEY({user, step:10});
        }
      }
  },

  MONEY: ({user, step}:TProps ) => {
    const {value} = DataOfRoles.MONEY;
    user.money = increment(user.money, step??value);
    playAudio(audioMoney, 0.4);
  },

  SWORD: ({user}:TProps) => {
    return user.actions.SWORD!.cb = (apponent?: CUser, cbDamageEffect?:Function) => {
      apponent = apponent!;
      const {value, rangeSteps} = DataOfRoles.SWORD;
      if(Math.abs(apponent.indCell - user.indCell) <= rangeSteps) {
        apponent.HP = decrement(apponent.HP, value);
        cbUserActions.MONEY({user, step:15});
      
        cbDamageEffect!();
        cb(user, ERoles.SWORD, 'qntyInventory');
      }
    }
  },
  HANDCUFFS: ({user}) => {
    const data = redefineData(user, ERoles.HANDCUFFS)
    const {value} = DataOfRoles.HANDCUFFS;
    data.qntyBuffs = value;
    return user.actions.HANDCUFFS!.cb = () => {
      data.qntyBuffs -= 1;
      if(data.qntyBuffs < 0) {
        cb(user, ERoles.HANDCUFFS, 'qntyBuffs');
        return true;
      }
      return false;
    }
  },
  POISON: ({user, cell}) => {
    const dataUser = redefineData(user, ERoles.POISON);
    const {rangeBuffs, value} = DataOfRoles.POISON;

    if(cell?.role === ERoles.POISON) {
      dataUser.qntyBuffs += rangeBuffs!;
      dataUser.isShow = true;
    }
    
    return user.actions.POISON!.cb = (apponent?: CUser, cbDamageEffect?:Function) => {
      if(apponent && cbDamageEffect) {
        const savedIndex = dataUser.apponents.length-1;
        const dataApponent = redefineData(apponent, ERoles.POISON)
        dataApponent.qntyBuffs = rangeBuffs!;
        const cbDamage = () => {
          if(user.name !== apponent.name && dataApponent.qntyBuffs > 0) {
            apponent.HP = decrement(apponent.HP, value);
            dataApponent.isShow = false;     
            cbDamageEffect();
            cbUserActions.MONEY({user, step:6});
            cb(apponent, ERoles.POISON, 'qntyBuffs');
          } else if (dataApponent.qntyBuffs <= 0) {
            dataUser.apponents.splice(savedIndex, 1);
            cb(apponent, ERoles.POISON, 'qntyBuffs');
          }
        }

        cbDamage();
        dataUser.apponents.push(cbDamage);
        cb(user, ERoles.POISON, 'qntyInventory');
      }
      else {
        if(dataUser.qntyBuffs > 0) {
          user.HP = decrement(user.HP, value);
          cb(user, ERoles.POISON, 'qntyBuffs');
        }
        
        dataUser.apponents.forEach((toDamage) => {
          toDamage();
        })
      }
    }
  },

  POTION: ({user, cell}) => {
    const dataUser = redefineData(user, ERoles.POTION);
    const {rangeBuffs, value} = DataOfRoles.POTION;

    if(cell?.role === ERoles.POTION) {
      dataUser.qntyBuffs += rangeBuffs!;
      dataUser.isShow = true;
    }
    
    return user.actions.POTION!.cb = (apponent?: CUser, cbDamageEffect?:Function) => {
      if(apponent && cbDamageEffect) {
        const savedIndex = dataUser.apponents.length-1;
        const dataApponent = redefineData(apponent, ERoles.POTION)
        dataApponent.qntyBuffs = rangeBuffs!;
        const cbDamage = () => {
          if(user.name !== apponent.name && dataApponent.qntyBuffs > 0) {
            apponent.HP = increment(apponent.HP, value);
            dataApponent.isShow = false;     
            cbDamageEffect();
            cb(apponent, ERoles.POTION, 'qntyBuffs');
          } else if (dataApponent.qntyBuffs <= 0) {
            dataUser.apponents.splice(savedIndex, 1);
            cb(apponent, ERoles.POTION, 'qntyBuffs');
          }
        }

        cbDamage();
        dataUser.apponents.push(cbDamage);
        cb(user, ERoles.POTION, 'qntyInventory');
      }
      else {
        if(dataUser.qntyBuffs > 0) {
          user.HP = increment(user.HP, value);
          cb(user, ERoles.POTION, 'qntyBuffs');
        }
        
        dataUser.apponents.forEach((toDamage) => {
          toDamage();
        })
      }
    }
  },
  
  NEXT: ({user, map}:TProps) => {
    const cell = map![user.indCell+2];
    user
    .setPosition(cell.x,cell.y)
    .setIndCell(cell.index);
    
    if(cell.role && cell.role in cbUserActions) {
      cbUserActions[cell.role]({user, cell, map});
    }
  },

  PORTAL: ({user, map}) => {
    const {rangeSteps} = DataOfRoles.PORTAL;
    const randomInd = getRandomDigit(Math.max(1, user.indCell-(rangeSteps-1)/2), Math.min(user.indCell+rangeSteps, map!.length-1));
    const cell = map![randomInd];

    user.isStartPorted = true;;
    stUsers.reload();
    const timeID = setTimeout(() => {
      user.isStartPorted = false;
      user.isPorted = true;
      user
      .setPosition(cell.x,cell.y)
      .setIndCell(cell.index);
      stUsers.reload();
      const timeID_1 = setTimeout(() => {
        user.isPorted = false;
        stUsers.reload();
        clearTimeout(timeID_1);
      }, 1000);
      clearTimeout(timeID);

    }, 1000)
    
    if(cell.role && cell.role in cbUserActions) {
      cbUserActions[cell.role]({user, cell, map});
    }
  },
}

const tabooRoles = [ERoles.MONEY, ERoles.POISON, ERoles.POTION, ERoles.PORTAL, ERoles.HANDCUFFS, ERoles.BOMB, ERoles.NEXT ];
export default (user: CUser, cell:CEntity, currStep:number, timeID: NodeJS.Timeout, map:CEntity[]) => {  
  if(cell.role && cell.role in cbUserActions && currStep === 0) {

    const s = user.actions.HANDCUFFS?.cb!();
    if(s === undefined || s) {
      if(!tabooRoles.includes(cell.role as ERoles)) {
        const data = redefineData(user, cell.role as ERoles);
        data.qntyBuffs = increment(data.qntyBuffs);
        data.qntyInventory = increment(data.qntyInventory);
       
        data.isShow = true;
        playAudio(audioPickUp);
      } 
      user
        .setPosition(cell.x,cell.y)
        .setIndCell(cell.index);

      cbUserActions[cell.role]({user,cell,map});
      user.actions.POISON?.cb !== undefined && user.actions.POISON.cb();
      user.actions.POTION?.cb !== undefined && user.actions.POTION.cb();
      clearInterval(timeID);
    }
   
  } else {
  
    const s = user.actions.HANDCUFFS?.cb!();
    if(s === undefined || s) {
     user.actions.POISON?.cb !== undefined && user.actions.POISON.cb();
     user.actions.POTION?.cb !== undefined && user.actions.POTION.cb();
      stUsers.getUsers().forEach((apponent) => {
        if( cell.index === apponent.indCell ) {
          cbUserActions.MONEY({user,step:5});
        }
      });

      user
      .setPosition(cell.x,cell.y)
      .setIndCell(cell.index);
    }
    
  }
}
