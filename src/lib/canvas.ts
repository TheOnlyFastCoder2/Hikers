import type { IPos } from "./types";

export function drawSpriteAnimation(ctx:CanvasRenderingContext2D, x:number, y:number, w:number, h:number, sprite:HTMLImageElement, c: number = 0, r: number = 0, deg:number=0) {
  ctx.save();
  ctx.translate(x + w/2, y + h/2);
  ctx.rotate(deg * Math.PI / 180);
  ctx.drawImage(sprite, w*c, h*r, w, h, -w/2, -h/2, w, h);
  ctx.restore();
}

export function loadSprite(path: string) {
  const sprite = new Image();
  sprite.src = path;
  return sprite;
}

export function checkCollision(obj1:IPos & {size:number}, obj2: IPos & {size:number}) {
  // Получаем координаты и размеры объектов
  const obj1Left = obj1.x;
  const obj1Right = obj1.x + obj1.size
  const obj1Top = obj1.y;
  const obj1Bottom = obj1.y + obj1.size;

  const obj2Left = obj2.x;
  const obj2Right = obj2.x + obj2.size
  const obj2Top = obj2.y;
  const obj2Bottom = obj2.y + obj2.size;

  // Проверяем, происходит ли пересечение по осям X и Y
  const xCollision = (obj1Right >= obj2Left && obj1Left <= obj2Right);
  const yCollision = (obj1Bottom >= obj2Top && obj1Top <= obj2Bottom);

  // Возвращаем true, если есть пересечение по обеим осям
  return xCollision && yCollision;
}