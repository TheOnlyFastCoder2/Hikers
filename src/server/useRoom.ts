import type { CUser } from "lib/types";
import { useEden } from "./useEden";

const eden = useEden();


export default function useRoom(user:CUser) {
  const ws = eden.room.subscribe()
  .subscribe((message) => {
    console.log("got", message)
  })
  .on('open', () => {
    ws.send({
      name: user.name,
      x: user.x,
      y: user.y,
    })
  })
}