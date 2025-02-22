import {
  BaseShape,
  Line,
  Rectangle,
  Ellipse,
  Triangle,
  Arrow,
  Pencil,
  CanvasText as Text,
  Image,
  CanvasText,
} from "./shapes";

export type ShapeType =
  | "line"
  | "rectangle"
  | "ellipse"
  | "triangle"
  | "arrow"
  | "pencil"
  | "select"
  | "text"
  | "image";

interface DrawingState {
  elements: (BaseShape | Pencil | Text | Image)[];
  selectedElementIndex: number | null;
  undoStack: (BaseShape | Pencil | Text | Image)[][];
  redoStack: (BaseShape | Pencil | Text | Image)[][];
}

export class DrawingManager {
  private state: DrawingState;
  private currentPencilPoints: number[][] = [];
  private isDrawingPencil: boolean = false;
  private maxUndoSteps: number = 50;

  private pencilOptions = {
    size: 8,
    smoothing: 0.58,
    thinning: 0.31,
    streamline: 0.6,
    easing: (t: number) => t,
    start: { taper: 0, cap: true },
    end: { taper: 0, cap: true },
  };

  constructor() {
    this.state = {
      elements: [],
      selectedElementIndex: null,
      undoStack: [],
      redoStack: [],
    };
  }

  // Shape Management Methods
  addShape(
    type: ShapeType,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: any
  ) {
    if (type === "pencil") {
      this.startPencilDrawing(x1, y1);
      return;
    }

    let shape: BaseShape | Image | Text;
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
      case "text":
        shape = new Text(x1, y1, options?.content || "Text");
        break;
      case "image":
        if (!options?.image) throw new Error("Image element required");
        shape = new Image(x1, y1, x2 - x1, y2 - y1, options.image);
        break;
      default:
        throw new Error("Invalid shape type");
    }

    this.saveState();
    this.state.elements.push(shape);
    this.state.redoStack = [];
  }

  updateShape(x2: number, y2: number) {
    if (this.isDrawingPencil) {
      this.addPencilPoint(x2, y2);
      return;
    }

    const lastElement = this.state.elements[this.state.elements.length - 1];
    if (lastElement instanceof BaseShape) {
      lastElement.x2 = x2;
      lastElement.y2 = y2;
      lastElement.generateElement();
    }
  }

  // Pencil Drawing Methods
  private startPencilDrawing(x: number, y: number) {
    this.saveState();
    this.isDrawingPencil = true;
    this.currentPencilPoints = [[x, y]];
  }

  private addPencilPoint(x: number, y: number) {
    if (!this.isDrawingPencil) return;

    this.currentPencilPoints.push([x, y]);
    const pencil = new Pencil(this.currentPencilPoints, this.pencilOptions);
    pencil.generateElement();

    // Replace the last pencil element for better performance
    // if (
    //   this.state.elements.length > 0 &&
    //   this.state.elements[this.state.elements.length - 1] instanceof Pencil
    // ) {
    //   this.state.elements[this.state.elements.length - 1] = pencil;
    // } else {
    //   this.state.elements.push(pencil);
    // }
    this.state.elements.push(pencil);
  }

  finishPencilDrawing() {
    if (this.currentPencilPoints.length > 1) {
      const pencil = new Pencil(this.currentPencilPoints, this.pencilOptions);
      pencil.generateElement();
      this.state.elements.push(pencil);
    }

    this.isDrawingPencil = false;
    this.currentPencilPoints = [];
  }

  // State Management Methods
  private saveState() {
    this.state.undoStack.push([...this.state.elements]);
    if (this.state.undoStack.length > this.maxUndoSteps) {
      this.state.undoStack.shift();
    }
  }

  undo() {
    if (this.state.undoStack.length === 0) return;

    const previousState = this.state.undoStack.pop()!;
    this.state.redoStack.push([...this.state.elements]);
    this.state.elements = previousState;
  }

  redo() {
    if (this.state.redoStack.length === 0) return;

    const nextState = this.state.redoStack.pop()!;
    this.state.undoStack.push([...this.state.elements]);
    this.state.elements = nextState;
  }

  // Selection Methods
  selectElementAt(x: number, y: number): boolean {
    for (let i = this.state.elements.length - 1; i >= 0; i--) {
      const element = this.state.elements[i];
      if (this.isPointInElement(x, y, element!)) {
        this.state.selectedElementIndex = i;
        return true;
      }
    }
    this.state.selectedElementIndex = null;
    return false;
  }

  private isPointInElement(
    x: number,
    y: number,
    element: BaseShape | Pencil | Text | Image
  ): boolean {
    if (element instanceof BaseShape) {
      const bounds = {
        left: Math.min(element.x1, element.x2),
        right: Math.max(element.x1, element.x2),
        top: Math.min(element.y1, element.y2),
        bottom: Math.max(element.y1, element.y2),
      };
      return (
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      );
    }
    // Add specific hit testing for other element types as needed
    return false;
  }

  // Canvas Drawing Method
  drawCanvas(ctx: CanvasRenderingContext2D, roughCanvas: any) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.state.elements.forEach((element, index) => {
      // Draw selection highlight if element is selected
      if (index === this.state.selectedElementIndex) {
        this.drawSelectionHighlight(ctx, element);
      }

      if (element instanceof Pencil) {
        ctx.fillStyle = "#000";
        ctx.fill(element.pencilElement);
      } else if (element instanceof Text) {
        element.draw(ctx);
      } else if (element instanceof Image) {
        element.draw(ctx);
      } else {
        roughCanvas.draw(element.roughElement);
      }
    });
  }

  private drawSelectionHighlight(
    ctx: CanvasRenderingContext2D,
    element: BaseShape | Pencil | Text | Image
  ) {
    ctx.save();
    ctx.strokeStyle = "#0099ff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (element instanceof BaseShape) {
      const padding = 5;
      ctx.strokeRect(
        Math.min(element.x1, element.x2) - padding,
        Math.min(element.y1, element.y2) - padding,
        Math.abs(element.x2 - element.x1) + padding * 2,
        Math.abs(element.y2 - element.y1) + padding * 2
      );
    }
    // Add specific highlight drawing for other element types as needed

    ctx.restore();
  }

  // Utility Methods
  clear() {
    this.saveState();
    this.state.elements = [];
    this.currentPencilPoints = [];
    this.isDrawingPencil = false;
    this.state.selectedElementIndex = null;
  }

  getElements() {
    return this.state.elements;
  }

  getSelectedElement() {
    return this.state.selectedElementIndex !== null
      ? this.state.elements[this.state.selectedElementIndex]
      : null;
  }

  moveSelectedElement(dx: number, dy: number) {
    if (this.state.selectedElementIndex === null) return;

    const element = this.state.elements[this.state.selectedElementIndex];

    if (element instanceof BaseShape) {
      element.x1 += dx;
      element.y1 += dy;
      element.x2 += dx;
      element.y2 += dy;
      element.generateElement();
    } else if (element instanceof CanvasText) {
      element.x += dx;
      element.y += dy;
    } else if (element instanceof Image) {
      element.x += dx;
      element.y += dy;
    }
  }
}
