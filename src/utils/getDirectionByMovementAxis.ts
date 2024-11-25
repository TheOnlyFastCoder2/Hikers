import type { TDirect } from "../lib/types";

export function  getDirectionByMovementAxis() {
  let prevX = 0, prevY = 0, direction:TDirect;
  return  (clientX:number, clientY:number): TDirect  => {
    const 
      deltaX = prevX - clientX,
      deltaY = prevY - clientY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
        direction = 'LEFT';
      } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
        direction = 'RIGHT';
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
        direction = 'TOP';
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
        direction = 'BOTTOM';
      }

      prevX = clientX;
      prevY = clientY;
      return direction;
  }
}