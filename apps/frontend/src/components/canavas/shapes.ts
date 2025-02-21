import rought from "roughjs";
import { getStroke, StrokeOptions } from "perfect-freehand";

const generator = rought.generator();

export abstract class BaseShape {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  roughElement: any;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  abstract generateElement(): void;
}

export class Line extends BaseShape {
  constructor(x1: number, y1: number, x2: number, y2: number) {
    super(x1, y1, x2, y2);
    this.generateElement();
  }

  generateElement() {
    this.roughElement = generator.line(this.x1, this.y1, this.x2, this.y2);
  }
}

export class Rectangle extends BaseShape {
  constructor(x1: number, y1: number, x2: number, y2: number) {
    super(x1, y1, x2, y2);
    this.generateElement();
  }

  generateElement() {
    this.roughElement = generator.rectangle(
      this.x1,
      this.y1,
      this.x2 - this.x1,
      this.y2 - this.y1
    );
  }
}

export class Ellipse extends BaseShape {
  constructor(x1: number, y1: number, x2: number, y2: number) {
    super(x1, y1, x2, y2);
    this.generateElement();
  }

  generateElement() {
    this.roughElement = generator.ellipse(
      this.x1,
      this.y1,
      this.x2 - this.x1,
      this.y2 - this.y1
    );
  }
}

export class Triangle extends BaseShape {
  constructor(x1: number, y1: number, x2: number, y2: number) {
    super(x1, y1, x2, y2);
    this.generateElement();
  }

  generateElement() {
    // Calculate the third point of the triangle
    // This creates an isosceles triangle where the third point
    // forms an equal angle with the other two points

    // Calculate the midpoint of the base
    const midX = (this.x1 + this.x2) / 2;
    const midY = (this.y1 + this.y2) / 2;

    // Calculate the perpendicular distance for the third point
    // This uses the base length to determine a proportional height
    const baseLength = Math.sqrt(
      Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2)
    );
    const height = baseLength * 0.866; // Approximately sqrt(3)/2 for equilateral

    // Calculate angle of the base line
    const angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);

    // Calculate the third point
    const x3 = midX - height * Math.sin(angle);
    const y3 = midY + height * Math.cos(angle);

    // Draw the triangle using rough.js path
    this.roughElement = generator.linearPath([
      [this.x1, this.y1],
      [this.x2, this.y2],
      [x3, y3],
      [this.x1, this.y1], // Close the path
    ]);
  }
}

// export class Arrow extends BaseShape {
//   arrowSize: number;

//   constructor(
//     x1: number,
//     y1: number,
//     x2: number,
//     y2: number,
//     arrowSize: number = 20
//   ) {
//     super(x1, y1, x2, y2);
//     this.arrowSize = arrowSize;
//     this.generateElement();
//   }

//   generateElement() {
//     // Calculate the angle of the main line
//     const angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);

//     // Arrowhead angle (30 degrees)
//     const arrowAngle = Math.PI / 6;

//     // Calculate arrowhead points
//     const x3 = this.x2 - this.arrowSize * Math.cos(angle - arrowAngle);
//     const y3 = this.y2 - this.arrowSize * Math.sin(angle - arrowAngle);
//     const x4 = this.x2 - this.arrowSize * Math.cos(angle + arrowAngle);
//     const y4 = this.y2 - this.arrowSize * Math.sin(angle + arrowAngle);

//     // Store all elements in an array instead of an object
//     this.roughElement = [
//       generator.line(this.x1, this.y1, this.x2, this.y2), // Main line
//       generator.line(this.x2, this.y2, x3, y3), // Left arrowhead line
//       generator.line(this.x2, this.y2, x4, y4), // Right arrowhead line
//     ];
//   }
// }

export class Arrow extends BaseShape {
  constructor(x1: number, y1: number, x2: number, y2: number) {
    super(x1, y1, x2, y2);
  }

  generateElement() {
    // Calculate the angle of the main line
    const angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);

    // Calculate the length of the line
    const length = Math.sqrt(
      Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2)
    );

    // Make arrowhead size proportional to line length
    const arrowSize = Math.min(length * 0.2, 20); // 20% of line length, max 20px
    const arrowAngle = Math.PI / 6; // 30 degrees

    // Find the point where arrowhead begins (slightly before x2, y2)
    const xBack = this.x2 - arrowSize * Math.cos(angle);
    const yBack = this.y2 - arrowSize * Math.sin(angle);

    // Calculate arrowhead points
    const x3 = xBack - arrowSize * Math.cos(angle - arrowAngle);
    const y3 = yBack - arrowSize * Math.sin(angle - arrowAngle);
    const x4 = xBack - arrowSize * Math.cos(angle + arrowAngle);
    const y4 = yBack - arrowSize * Math.sin(angle + arrowAngle);

    // Create the arrow using a single path
    this.roughElement = generator.linearPath([
      [this.x1, this.y1], // Start of line
      [this.x2, this.y2], // End of line
      [x3, y3], // First point of arrowhead
      [this.x2, this.y2], // Back to tip
      [x4, y4], // Second point of arrowhead
    ]);
  }
}

export class Pencil {
  points: number[][];
  options: StrokeOptions;
  pencilElement: any;

  constructor(
    points: number[][],
    options: any = {
      size: 10,
      smoothing: 0.58,
      thinning: 0.31,
      streamline: 0.6,
      easing: (t: any) => t,
      start: {
        taper: 0,
        cap: true,
      },
      end: {
        taper: 0,
        cap: true,
      },
    }
  ) {
    this.points = points;
    this.options = options;
  }

  getSvgPathFromStroke(stroke: number[][]) {
    if (!stroke.length) return "";

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      // @ts-ignore
      ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
  }

  generateElement() {
    const stroke = getStroke(this.points, this.options);
    const pathData = this.getSvgPathFromStroke(stroke);
    const myPath = new Path2D(pathData);
    this.pencilElement = myPath;
  }
}
