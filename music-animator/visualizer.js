const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const BAR_CANVAS_HEIGHT = 100;
const BACKGROUND_COLOR = "white";
const BAR_COLOR = generateRandomColor();
const COLOR = "black";
const WIDTH = 10;


const SHAPE = {
  'CIRCLE': 'CIRCLE',
  'BARS': 'BARS',
  'SPIRAL': 'SPIRAL',
  'SQUIGGLY': 'SQUIGGLY',
  'SEMI_CIRCLE': 'SEMI_CIRCLE',
  'LINE': 'LINE',
};

class AbstractVisualizer {
  constructor() {
    this.shapeArr = [];
    this.canvas = document.getElementById('canvas');
    this.barCanvas = document.getElementById('bar-canvas');
    this.growScale = 2;
    this.shrinkScale = 1.2;
  }

  renderBeatAnimation() {
    throw new Error('Please extend class an override method');
  }

  start() {
    this.drawBackground(this.canvas, {width: CANVAS_WIDTH, height: CANVAS_HEIGHT});
    this.drawBackground(this.barCanvas, {width: CANVAS_WIDTH, height: BAR_CANVAS_HEIGHT});
  }

  clearAllShapes() {
    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawShape(shape, scale = 1.0) {
    switch(shape.type) {
      case SHAPE.CIRCLE:
        this.drawCircle(shape.point, shape.radius * scale, {color: shape.color, width: shape.width});
        break;
      case SHAPE.SPIRAL:
        this.addSpiral(shape.i * scale, shape.startingPoint);
        break;
      case SHAPE.SQUIGGLY:
        this.drawCircle(shape.point, shape.radius * scale, {color: shape.color, width: shape.width});
        break;
      case SHAPE.SEMI_CIRCLE:
        this.drawCircle(shape.point, shape.radius * scale, {color: shape.color, width: shape.width});
        break;
      case SHAPE.LINE:
        this.drawCircle(shape.point, shape.radius * scale, {color: shape.color, width: shape.width});
        break;
    }
  }

  shrinkShapes() {
    this.clearAllShapes();
    // 2) "Animate" existing shapes by re-drawing them on the canvas and
    // shrinking or growing them based on the boolean isGrowing (flips back and
    // forth).
    this.shapeArr.forEach((shape) => {
        this.drawShape(shape, this.shrinkScale);
    });
  }

  growShapes() {
    this.clearAllShapes();

    // 2) "Animate" existing shapes by re-drawing them on the canvas and
    // shrinking or growing them based on the boolean isGrowing (flips back and
    // forth).
    this.shapeArr.forEach((shape) => {
        this.drawShape(shape, this.growScale);
    });
  }

  drawBars() {
    const canvas = this.canvas;
    const context = canvas.getContext("2d");
    const numBars = 100;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = BAR_COLOR;
    for (let n = 0; n < numBars; n++) {
      bar_x = n * (CANVAS_WIDTH / numBars);
      bar_width = 2;
      bar_height = -(data[n] / 6);
      context.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
  }

  // The Archimedean spiral is expressed as r=a+b(angle).
  // Convert that into x, y coordinate, it will be expressed as:
  // x=(a+b*angle)*cos(angle)
  // y=(a+b*angle)*sin(angle)
  // Returns the (x, y) point to draw at to form the spiral.
  addSpiral(i, startingPoint) {
    this.drawSpiral(i, startingPoint);
    this.shapeArr.push({
      type: 'SPIRAL',
      i,
      startingPoint,
    });
  }

  drawSpiral(i, startingPoint) {
    const canvas = this.canvas;
    const angle = 0.1 * i;
    const x = (1 + angle) * Math.cos(angle) + startingPoint.x;
    const y = (1 + angle) * Math.sin(angle) + startingPoint.y;
    return {x, y};
  }


  // Generates a random set of points (x, y) for a certain range [min, max] (inclusive)
  generateRandomPoint(range) {
    return {
      x: generateRandomValue(range.min, range.max),
      y: generateRandomValue(range.min, range.max),
    };
  }


  drawBackground(canvas, canvasDimensions, color = BACKGROUND_COLOR) {
    const context = canvas.getContext("2d");
    context.canvas.width = canvasDimensions.width;
    context.canvas.height = canvasDimensions.height;
    context.fillStyle = color;
    context.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
  }

  drawLine(startPoint, endPoint, lineProperties) {
    const canvas = this.canvas;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.lineWidth = lineProperties.width || WIDTH;
    context.strokeStyle = lineProperties.color || COLOR;
    context.stroke();
  }

  drawSemiCircle(startPoint, radius, startAngle, endAngle, width, color) {
    const canvas = this.canvas;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.arc(startPoint.x, startPoint.y, radius, startAngle, endAngle);
    context.lineWidth = width;
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
  }

  addCircle(centerPoint, radius, circleProperties) {
    this.drawCircle(centerPoint, radius, circleProperties);

    const shapeObj = {
      type: SHAPE.CIRCLE,
      radius,
      point: centerPoint,
      color: circleProperties.color,
      width: circleProperties.width,
    }
    this.shapeArr.push(shapeObj);
  }

  drawCircle(centerPoint, radius, circleProperties) {
      const color = circleProperties.color || COLOR;
      const context = canvas.getContext("2d");
      context.fillStyle = color;
      context.beginPath();
      context.arc(centerPoint.x, centerPoint.y, radius, 0, 2 * Math.PI);
      context.fill();
      context.lineWidth = circleProperties.width || WIDTH;
      context.strokeStyle = color;
      context.stroke();
  }

  drawSquigglyLine(startPoint, radius, lineProperties) {
      const width = lineProperties.width || WIDTH;
      const color = lineProperties.color || COLOR;
      const context = canvas.getContext("2d");
      
      const endPoint = {
        x: startPoint.x + 6 * radius,
        y: startPoint.y,
      };
      
      const vector = {
        x: endPoint.x - startPoint.x,
        y: endPoint.y - startPoint.y,
      };
      const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      const normalVector = {
        x: vector.x / length,
        y: vector.y / length,
      };
      
      drawSemiCircle(
        context, 
        {x: startPoint.x, y: startPoint.y}, 
        radius, 
        0, 
        Math.PI, 
        width, 
        color);
      drawSemiCircle(
        context, 
        {x: (startPoint.x + 2 * radius), y: startPoint.y}, 
        radius,  
        Math.PI, 
        0,
        width, 
        color);
      drawSemiCircle(
        context, 
        {x: (startPoint.x + 4 * radius), y: startPoint.y}, 
        radius, 
        0, 
        Math.PI, 
        width, 
        color);
      drawSemiCircle(
        context, 
        {x: endPoint.x, y: endPoint.y}, 
        radius,  
        Math.PI, 
        0,
        width, 
        color);
  }
}


function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
  return color;
}

// Generates a random value between [min, max] (inclusive).
function generateRandomValue(minValue = 1, maxValue = 10) {
  min = Math.ceil(minValue);
  max = Math.floor(maxValue);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
