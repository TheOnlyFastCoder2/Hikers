import { checkCollision } from "lib/canvas";
import type { IPos } from "lib/types";

interface MouseCoordinates {
  x: number;
  y: number;
}

class Circle {
  impuls:number;
  maxRadius: number;
  minRadius: number;

  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;

  constructor(x: number, y: number, dx: number, dy: number, radius: number, color: string) {
    this.maxRadius = radius * 2;
    this.minRadius = radius;
    this.impuls = 5;
    this.x = x || 50;
    this.y = y || 50;
    this.dx = dx || 5;
    this.dy = dy || 5;
    this.radius = radius || 15;
    this.color = color || 'blue';
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.radius, this.radius, this.radius*2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  
  update(c: CanvasRenderingContext2D, mouse: MouseCoordinates) {

    this.dx =
      this.x > c.canvas.width - this.radius || this.x < this.radius
        ? -this.dx
        : this.dx;
    this.x += this.dx;

    this.dy =
      this.y > c.canvas.height - this.radius || this.y < this.radius
        ? -this.dy
        : this.dy;
    this.y += this.dy;

    const isCollision = checkCollision({x:mouse.x, y:mouse.y, size: 20,}, {x:this.x, y:this.y, size: this.radius});

    if(isCollision) {
      this.dx = mouse.x - this.x < 0 ? this.dx + this.impuls : this.dx - this.impuls;
      this.dy = mouse.y - this.y < 0 ? this.dy + this.impuls : this.dy - this.impuls;
    }
    
    if(Math.abs(this.dx) > 1 && Math.abs(this.dy) > 1) {
      this.dx = this.dx > 0 ? this.dx - 0.08 : this.dx + 0.08;
      this.dy = this.dy > 0 ? this.dy - 0.08 : this.dy + 0.08;
    }
 
    this.draw(c);
  }
}

export default class CanvasAnimation {
  c: CanvasRenderingContext2D;
  mouse: MouseCoordinates;
  prevMouse: MouseCoordinates;
  circleQuantity: number;
  circleMinSize: number;
  circleMaxSize: number;
  circleArray: Circle[];
  colorArray: Array<string> = [
    '#5C4B51',
    '#8CBEB2',
    '#F3B562',
    '#F06060',
  ];

  constructor(ctx: CanvasRenderingContext2D, circleQuantity: number, circleMinSize: number, circleMaxSize: number) {
    this.c = ctx;
    this.mouse = { x: 0,y: 0};
    this.prevMouse = { x: 0,y: 0};
    this.circleQuantity = circleQuantity;
    this.circleMinSize = circleMinSize;
    this.circleMaxSize = circleMaxSize;
    this.circleArray = [];

    this.init();
  }

  //Function to get a random color
  getRandomColor() {
    return this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
  }

  resize(width:number, height:number) {
    this.c.canvas.width = width;
    this.c.canvas.height = height;

    this.init();
  }

  handleMouseMove(e: MouseCoordinates) {
    const xBorderProximity = e.x <= 5 || e.x >= this.c.canvas.width - 5;
    const yBorderProximity = e.y <= 5 || e.y >= this.c.canvas.height - 5;

    if (!(xBorderProximity && yBorderProximity)) {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      
    } else {
      this.mouse.x = 0;
      this.mouse.y = 0;
    }
    
    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;
  }

  init() {
    this.circleArray = [];

    for (let i = 0; i < this.circleQuantity; i++) {
      const radius =
        this.circleMinSize - 1 +
        (this.circleMaxSize - this.circleMinSize) * Math.random();
      const x =
        Math.random() * (innerWidth - radius * 2) + radius;
      const y =
        Math.random() * (innerHeight - radius * 2) + radius;
      const dx = (Math.random() - 0.5) * 5;
      const dy = (Math.random() - 0.5) * 5;
      const color = this.getRandomColor();

      this.circleArray[i] = new Circle(x, y, dx, dy, radius, color);
      this.circleArray[i].draw(this.c);
    }
  }

  animate() {
    this.c.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < this.circleArray.length; i++) {
      this.circleArray[i].update(this.c,this.mouse);
    }
  }
}