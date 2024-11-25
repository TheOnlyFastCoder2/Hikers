import {writable} from 'svelte/store';
import type { CEnity, CUser, TUserAction } from 'lib/types';

export function stUsers() {
  const {subscribe, update, set} = writable<CUser[]>([]);

  return {
    subscribe,
    reset: () =>  set([]),
    reload: (users?:CUser[]) => update((store) => users ? users : store),
    
    getUsers: () => {
      let users: CUser[];
      subscribe((store) => {
        users = store;
      });
      return users!;
    },
    reloadPosition: (map:CEnity[]) => {
      update((users) => {
        users.forEach((user) => {
          const cell = map[user.indCell];
          user.x = cell.x;
          user.y = cell.y; 
        })
        return users;
      })
    }, 
    setRank: (currUser: CUser) => {
      update((users) => {
        let rank = 0;
        users.forEach((user) => {
          if(user.finalRank !== 0 && currUser.name !== user.name) {
            rank++
          }
        });

        currUser.finalRank = rank + 1;
        return users;
      });

      return currUser;
    },

    checkIsAllDeadOrFinished: () => {
      let qntyTotalUsers = 0;
      let qntyDiedUsers = 0;
      let qntyFinishedUsers = 0;
      subscribe((store) => {
        qntyTotalUsers = store.length-1;
        store.forEach((user) => {
          if(user.isDied) {
            qntyDiedUsers++;
          }
          if(user.isFinished) {
            qntyFinishedUsers++;
          }
        });
      })

      return {
        qntyTotalUsers,
        qntyDiedUsers,
        qntyFinishedUsers,
        qntyinishedAndDiedUsers:qntyTotalUsers - qntyDiedUsers - qntyFinishedUsers,
        isAllFinished: qntyFinishedUsers >= qntyTotalUsers,
        isAllDeads: qntyDiedUsers >= qntyTotalUsers,
      }
    },

    toDoStep: function (
      map:CEnity[], user:CUser, qntySteps: number, userActions:TUserAction,
      cbListenerMove: (user:CUser) => void, 
      cbResetActiveUser: Function , 
      speed:number = 500
    ): NodeJS.Timeout {

      const timeID = setInterval(() => {
        if(qntySteps > 0) {
          qntySteps--;
          const cell = map[user!.indCell + 1];
          if(cell !== undefined) {
            userActions(user, cell, qntySteps, timeID, map);
            this.reload();
            cbListenerMove(user);
          } else {
            cbListenerMove(user);
            cbResetActiveUser();
            clearInterval(timeID)
          };
        } 

        if(qntySteps <= 0) {
          cbResetActiveUser();
          clearInterval(timeID);
        }
      }, speed);
 
      return timeID;
    },

    getActiveUser: () => {
      let user:CUser|undefined;
      subscribe((store) => {
        user = store.find((user) => user.isMe);
        return store;
      })
      return user;
    },


    addUser: (cell:CUser) => update((store) => {
      store.push(cell);
      return store;
    }),
  }
}

export default stUsers();
