import Point from "./Point";

export default class Path {
  points: Point[];
  
  constructor() {
    this.points = [];
  }

  addPoint(point: Point) {
    this.points.push(point);
  }

  draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {


    for (let i = 0; i < this.points.length - 1; i++) {
      const point1 = this.points[i];
      const point2 = this.points[i + 1];

      context.strokeStyle = "white";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(point1.x * canvas.width, point1.y * canvas.height);
      context.lineTo(point2.x * canvas.width, point2.y * canvas.height);
      context.stroke();
    }
  }
}