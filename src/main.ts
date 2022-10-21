import Canvas from './models/Canvas';
import Point from './models/Point';
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="position: relative;">
    <canvas
      id="canvas"
      width="440"
      height="440"
      style="
        background-color: #000000;
        position: relative;
      "
    >
    </canvas>

    <div style="margin: 10px; color: white; font-family: Arial">
      draw a line inside the canvas
      <span style="font-size: 12px; opacity: 0.7" id="loading"></span>
    </div>
  </div>
`;


function getColorIndicesForCoord(x: number, y: number, width: number) {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
}

let canvas: Canvas | null = null;
function onContextChange(context: CanvasRenderingContext2D) {
  if (!canvas) return;
  const imageData = context.getImageData(
    0,
    0,
    canvas.canvas.width,
    canvas.canvas.height,
  );

  for (let i = 0; i < canvas.canvas.width; i++) {
    for (let j =0; j < canvas.canvas.height; j++) {
      const x = i / canvas.canvas.width;
      const y = j / canvas.canvas.height;


      const colorIndices = getColorIndicesForCoord(i, j, canvas.canvas.width);
      const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;

      const currentPoint = new Point(x, y);

      let degree = 0;
      let lastVector = null;
      let firstVector = null;
      let isIncreasing = true;
      for (const path of canvas.paths) {
        for (const targetPoint of path.points) {
          const vec = Point.vector(currentPoint, targetPoint);
          if (lastVector && firstVector) {
            const angle = Point.calculateAngle(lastVector, vec);
            const angleByFirstVector = Point.calculateAngle(firstVector, vec);
            if (Math.abs(angleByFirstVector - Math.PI) <= 0.00001) {
              isIncreasing = !isIncreasing;
            }
            degree = isIncreasing ? degree + angle : degree - angle;
            lastVector = vec;
          } else {
            lastVector = vec;
            if (!firstVector) {
              firstVector = vec;
            }
          }
        }
      }

      const normalizedDegree = degree / (2 * Math.PI);

      let color = (Math.abs(normalizedDegree) * 185);

      imageData.data[redIndex] = color > 0 ? color : 0;
      imageData.data[greenIndex] = 0;
      imageData.data[blueIndex] = (255 - color);
      imageData.data[alphaIndex] = color;
    }

    context.putImageData(imageData, 0, 0);
  }
}

canvas = new Canvas('canvas', onContextChange);


