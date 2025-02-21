import {
  BaseShape,
  Line,
  Rectangle,
  Ellipse,
  Triangle,
  Arrow,
  Pencil,
} from "./shapes";
import { getStroke } from "perfect-freehand";

export type ShapeType =
  | "line"
  | "rectangle"
  | "ellipse"
  | "triangle"
  | "arrow"
  | "pencil"
  | "select";

export class DrawingManager {
  elements: (BaseShape | Pencil)[] = [];
  private currentPencilPoints: number[][] = [];
  private isDrawingPencil: boolean = false;

  private pencilOptions = {
    size: 8,
    smoothing: 0.58,
    thinning: 0.31,
    streamline: 0.6,
    easing: (t: number) => t,
    start: {
      taper: 0,
      cap: true,
    },
    end: {
      taper: 0,
      cap: true,
    },
  };

  addShape(type: ShapeType, x1: number, y1: number, x2: number, y2: number) {
    if (type === "pencil") {
      this.startPencilDrawing(x1, y1);
      return;
    }

    let shape: BaseShape;
    switch (type) {
      case "line":
        shape = new Line(x1, y1, x2, y2);
        break;
      case "rectangle":
        shape = new Rectangle(x1, y1, x2, y2);
        break;
      case "ellipse":
        shape = new Ellipse(x1, y1, x2, y2);
        break;
      case "triangle":
        shape = new Triangle(x1, y1, x2, y2);
        break;
      case "arrow":
        shape = new Arrow(x1, y1, x2, y2);
        break;
      default:
        throw new Error("Invalid shape type");
    }
    this.elements.push(shape);
  }

  updateShape(x2: number, y2: number) {
    if (this.isDrawingPencil) {
      this.addPencilPoint(x2, y2);
      return;
    }

    const lastElement = this.elements[this.elements.length - 1];
    if (lastElement instanceof BaseShape) {
      lastElement.x2 = x2;
      lastElement.y2 = y2;
      lastElement.generateElement();
    }
  }

  startPencilDrawing(x: number, y: number) {
    this.isDrawingPencil = true;
    this.currentPencilPoints = [[x, y]];
  }

  addPencilPoint(x: number, y: number) {
    if (!this.isDrawingPencil) return;

    this.currentPencilPoints.push([x, y]);
    const pencil = new Pencil(this.currentPencilPoints, this.pencilOptions);
    pencil.generateElement();

    // If we already have a pencil element, update it
    // if (this.elements.length > 0 && this.elements[this.elements.length - 1] instanceof Pencil) {
    //   this.elements[this.elements.length - 1] = pencil;
    // } else {
    //   this.elements.push(pencil);
    // }

    this.elements.push(pencil);
  }

  finishPencilDrawing() {
    if (this.currentPencilPoints.length > 1) {
      const pencil = new Pencil(this.currentPencilPoints, this.pencilOptions);
      pencil.generateElement();

      // Replace the last pencil element if it exists
      // if (this.elements.length > 0 && this.elements[this.elements.length - 1] instanceof Pencil) {
      //   this.elements[this.elements.length - 1] = pencil;
      // } else {
      //   this.elements.push(pencil);
      // }
      this.elements.push(pencil);
    }

    this.isDrawingPencil = false;
    this.currentPencilPoints = [];
  }

  drawCanvas(ctx: CanvasRenderingContext2D, roughCanvas: any) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.elements.forEach((element) => {
      if (element instanceof Pencil) {
        ctx.fillStyle = "#000";
        ctx.fill(element.pencilElement);
      } else {
        roughCanvas.draw(element.roughElement);
      }
    });
  }

  clear() {
    this.elements = [];
    this.currentPencilPoints = [];
    this.isDrawingPencil = false;
    redrawCanvas();
  }
}
