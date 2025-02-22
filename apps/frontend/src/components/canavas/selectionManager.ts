import { CanvasText } from "./shapes";

export interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SelectionHandler {
  private selectedElement: any | null = null;
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private originalBounds: SelectionBounds | null = null;
  private resizeHandle: string | null = null;

  // Padding around elements for selection box
  private readonly PADDING = 10;
  // Size of resize handles
  private readonly HANDLE_SIZE = 8;

  constructor(private ctx: CanvasRenderingContext2D) {}

  // Check if a point is within an element's bounds
  hitTest(x: number, y: number, element: any): boolean {
    const bounds = this.getElementBounds(element);
    return (
      x >= bounds.x - this.PADDING &&
      x <= bounds.x + bounds.width + this.PADDING &&
      y >= bounds.y - this.PADDING &&
      y <= bounds.y + bounds.height + this.PADDING
    );
  }

  // Get standardized bounds for any element type
  getElementBounds(element: any): SelectionBounds {
    if (element instanceof CanvasText) {
      // For text elements
      const metrics = this.ctx.measureText(element.content);
      return {
        x: element.x,
        y: element.y - element.fontSize,
        width: metrics.width,
        height: element.fontSize,
      };
    } else if ("pencilElement" in element) {
      // For pencil strokes
      const points = element.points;
      let minX = Infinity,
        minY = Infinity;
      let maxX = -Infinity,
        maxY = -Infinity;

      points.forEach(([x, y]: (number | undefined)[]) => {
        if (x !== undefined && y !== undefined) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      });

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    } else {
      // For basic shapes
      return {
        x: Math.min(element.x1, element.x2),
        y: Math.min(element.y1, element.y2),
        width: Math.abs(element.x2 - element.x1),
        height: Math.abs(element.y2 - element.y1),
      };
    }
  }

  // Draw selection box and handles
  drawSelection() {
    if (!this.selectedElement) return;

    const bounds = this.getElementBounds(this.selectedElement);

    // Draw selection rectangle
    this.ctx.strokeStyle = "#0095ff";
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(
      bounds.x - this.PADDING,
      bounds.y - this.PADDING,
      bounds.width + this.PADDING * 2,
      bounds.height + this.PADDING * 2
    );
    this.ctx.setLineDash([]);

    // Draw resize handles
    this.ctx.fillStyle = "#ffffff";
    this.ctx.strokeStyle = "#0095ff";
    this.drawHandle(bounds.x - this.PADDING, bounds.y - this.PADDING); // Top-left
    this.drawHandle(
      bounds.x + bounds.width + this.PADDING,
      bounds.y - this.PADDING
    ); // Top-right
    this.drawHandle(
      bounds.x - this.PADDING,
      bounds.y + bounds.height + this.PADDING
    ); // Bottom-left
    this.drawHandle(
      bounds.x + bounds.width + this.PADDING,
      bounds.y + bounds.height + this.PADDING
    ); // Bottom-right
  }

  private drawHandle(x: number, y: number) {
    this.ctx.fillRect(
      x - this.HANDLE_SIZE / 2,
      y - this.HANDLE_SIZE / 2,
      this.HANDLE_SIZE,
      this.HANDLE_SIZE
    );
    this.ctx.strokeRect(
      x - this.HANDLE_SIZE / 2,
      y - this.HANDLE_SIZE / 2,
      this.HANDLE_SIZE,
      this.HANDLE_SIZE
    );
  }

  // Check if a point is on a resize handle
  private getResizeHandle(x: number, y: number): string | null {
    if (!this.selectedElement) return null;

    const bounds = this.getElementBounds(this.selectedElement);
    const handles = {
      nw: { x: bounds.x - this.PADDING, y: bounds.y - this.PADDING },
      ne: {
        x: bounds.x + bounds.width + this.PADDING,
        y: bounds.y - this.PADDING,
      },
      sw: {
        x: bounds.x - this.PADDING,
        y: bounds.y + bounds.height + this.PADDING,
      },
      se: {
        x: bounds.x + bounds.width + this.PADDING,
        y: bounds.y + bounds.height + this.PADDING,
      },
    };

    for (const [handle, pos] of Object.entries(handles)) {
      if (
        x >= pos.x - this.HANDLE_SIZE / 2 &&
        x <= pos.x + this.HANDLE_SIZE / 2 &&
        y >= pos.y - this.HANDLE_SIZE / 2 &&
        y <= pos.y + this.HANDLE_SIZE / 2
      ) {
        return handle;
      }
    }

    return null;
  }

  // Start dragging or resizing
  handleMouseDown(x: number, y: number, elements: any[]) {
    if (this.selectedElement) {
      this.resizeHandle = this.getResizeHandle(x, y);
      if (this.resizeHandle) {
        this.isResizing = true;
        this.originalBounds = this.getElementBounds(this.selectedElement);
        this.dragStartX = x;
        this.dragStartY = y;
        return true;
      }

      if (this.hitTest(x, y, this.selectedElement)) {
        this.isDragging = true;
        this.dragStartX = x;
        this.dragStartY = y;
        return true;
      }
    }

    // Try to select a new element
    for (let i = elements.length - 1; i >= 0; i--) {
      if (this.hitTest(x, y, elements[i])) {
        this.selectedElement = elements[i];
        this.isDragging = true;
        this.dragStartX = x;
        this.dragStartY = y;
        return true;
      }
    }

    this.selectedElement = null;
    return false;
  }

  // Handle dragging or resizing
  handleMouseMove(x: number, y: number) {
    if (!this.selectedElement) return false;

    if (this.isDragging) {
      const dx = x - this.dragStartX;
      const dy = y - this.dragStartY;

      if (this.selectedElement instanceof CanvasText) {
        this.selectedElement.x += dx;
        this.selectedElement.y += dy;
      } else if ("pencilElement" in this.selectedElement) {
        this.selectedElement.points = this.selectedElement.points.map(
          ([px, py]: (number | undefined)[]) => {
            if (px !== undefined && py !== undefined) {
              return [px + dx, py + dy];
            }
            return [px, py];
          }
        );
      } else {
        this.selectedElement.x1 += dx;
        this.selectedElement.y1 += dy;
        this.selectedElement.x2 += dx;
        this.selectedElement.y2 += dy;
      }

      this.dragStartX = x;
      this.dragStartY = y;
      return true;
    }

    if (this.isResizing && this.originalBounds && this.resizeHandle) {
      const dx = x - this.dragStartX;
      const dy = y - this.dragStartY;

      let newBounds = { ...this.originalBounds };

      switch (this.resizeHandle) {
        case "se":
          newBounds.width += dx;
          newBounds.height += dy;
          break;
        case "sw":
          newBounds.x += dx;
          newBounds.width -= dx;
          newBounds.height += dy;
          break;
        case "ne":
          newBounds.width += dx;
          newBounds.y += dy;
          newBounds.height -= dy;
          break;
        case "nw":
          newBounds.x += dx;
          newBounds.width -= dx;
          newBounds.y += dy;
          newBounds.height -= dy;
          break;
      }

      // Apply new bounds to element
      if (
        !(this.selectedElement instanceof CanvasText) &&
        !("pencilElement" in this.selectedElement)
      ) {
        this.selectedElement.x1 = newBounds.x;
        this.selectedElement.y1 = newBounds.y;
        this.selectedElement.x2 = newBounds.x + newBounds.width;
        this.selectedElement.y2 = newBounds.y + newBounds.height;
      }

      return true;
    }

    return false;
  }

  // End dragging or resizing
  handleMouseUp() {
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
    this.originalBounds = null;
  }

  getSelectedElement() {
    return this.selectedElement;
  }

  clearSelection() {
    this.selectedElement = null;
  }
}
