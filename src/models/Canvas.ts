import Path from "./Path";
import Point from "./Point";

type OnChange = (context: CanvasRenderingContext2D) => void;

export default class Canvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  paths: Path[] = [];
  targetPoint: Point;

  private currentPath: Path | null = null;
  onChange: OnChange;

  constructor(canvasId: string, onChange: OnChange) {
    const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }
    const context = canvasElement.getContext("2d", {willReadFrequently: true});
    if (!context) {
      throw new Error(`Context for canvas with id ${canvasId} not found`);
    }

    this.canvas = canvasElement;
    this.context = context;
    this.targetPoint = new Point(0.5, 0.5);
    this.onChange = onChange;

    this.canvas.addEventListener("mousedown", this.onStartDraw.bind(this));
    this.canvas.addEventListener("mouseup", this.onEndDraw.bind(this));
    this.canvas.addEventListener("mouseleave", this.onEndDraw.bind(this));
    this.canvas.addEventListener("mousemove", this.onDraw.bind(this));
  }

  private onStartDraw(e: MouseEvent) {
    document.querySelector<HTMLSpanElement>('#loading')!.innerText = '[ calculating... ]';
    this.paths = [];
    this.currentPath = new Path();
    this.currentPath.addPoint(this.getRelativeLocation(e));
  }

  private onEndDraw(e: MouseEvent) {
    if (!this.currentPath) return;

    this.currentPath.addPoint(this.getRelativeLocation(e));
    this.paths.push(this.currentPath);
    this.currentPath = null;
    this.onChange(this.context);
    this.paths.forEach(path => path.draw(this.context, this.canvas));
    document.querySelector<HTMLSpanElement>('#loading')!.innerText = '';
  }

  private onDraw(e: MouseEvent) {
    if (!this.currentPath) return;
    const point = this.getRelativeLocation(e);
    // this.onChange(this.context);
    this.currentPath.addPoint(point);
  }

  private getRelativeLocation(e: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return new Point(x, y);
  }
}
