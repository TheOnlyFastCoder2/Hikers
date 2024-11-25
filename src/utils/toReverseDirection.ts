import type { TDirect } from "../lib/types";

export default function toReverseDirection(direction:TDirect): TDirect {
  switch(direction) {
    case 'RIGHT': return 'LEFT';
    case 'LEFT': return 'RIGHT';
    case 'BOTTOM': return 'TOP';
    case 'TOP': return 'BOTTOM';
  }
}