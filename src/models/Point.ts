export default class Point { // point could be a vector :)
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static vector(point1: Point, point2: Point): Point {
    return new Point(point2.x - point1.x, point2.y - point1.y);
  }

  static dotProduct(point1: Point, point2: Point): number {
    return point1.x * point2.x + point1.y * point2.y;
  }

  static calculateAngle(vec1: Point, vec2: Point): number {
    let cos = Point.dotProduct(vec1, vec2) / (vec1.magnitude() * vec2.magnitude())
    if (cos >= 1) cos = cos - (cos % 1);
    if (cos <= -1) cos = cos - (cos % Math.PI);
    return Math.acos(cos);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  unitVector(): Point {
    const magnitude = this.magnitude();
    return new Point(this.x / magnitude, this.y / magnitude);
  }
}
