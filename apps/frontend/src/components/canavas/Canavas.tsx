"use client";

import React, { useEffect, useRef, useState } from "react";
import { RoughCanvas } from "roughjs/bin/canvas";
import { DrawingManager, ShapeType } from "./drawingManager";
import { getStroke } from "perfect-freehand";
import rough from "roughjs";
import { getMousePosition } from "./helper";
import ToolBar from "./Toolbar";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const roughCanvasRef = useRef<RoughCanvas | null>(null);
  const drawingManagerRef = useRef(new DrawingManager());
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ShapeType>("rectangle");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  const resizeCanvas = () => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const scale = window.devicePixelRatio;

    // Set canvas size with pixel density consideration
    canvas.width = container.clientWidth * scale;
    canvas.height = container.clientHeight * scale;
    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientHeight}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(scale, scale);
      redrawCanvas();
    }
  };

  const redrawCanvas = () => {
    if (!canvasRef.current || !roughCanvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawingManagerRef.current.drawCanvas(ctx, roughCanvasRef.current);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    roughCanvasRef.current = rough.canvas(canvasRef.current);
    resizeCanvas();

    const resizeHandler = () => {
      requestAnimationFrame(resizeCanvas);
    };

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent) => {
    // if (!canvasRef.current) return;

    // setIsDrawing(true);
    // const { x, y } = getMousePosition(event.nativeEvent, canvasRef.current);
    // setStartPoint({ x, y });

    // if (selectedTool === "pencil") {
    //   drawingManagerRef.current.startPencilDrawing(x, y);
    // } else {
    //   drawingManagerRef.current.addShape(selectedTool, x, y, x, y);
    // }

    if (!canvasRef.current) return;
    setIsDrawing(true);
    const { x, y } = getMousePosition(event.nativeEvent, canvasRef.current);
    drawingManagerRef.current.addShape(selectedTool, x, y, x, y);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    // if (!isDrawing || !canvasRef.current || !roughCanvasRef.current) return;

    // const { x, y } = getMousePosition(event.nativeEvent, canvasRef.current);

    // if (selectedTool === "pencil") {
    //   drawingManagerRef.current.addPencilPoint(x, y);
    //   redrawCanvas();
    // } else {
    //   const elements = drawingManagerRef.current.elements;
    //   if (elements.length === 0) return;

    //   const lastElement = elements[elements.length - 1];
    //   if (lastElement) {
    //     lastElement.updateEndPoint(x, y);
    //     redrawCanvas();
    //   }
    // }

    if (!isDrawing || !canvasRef.current) return;
    const { x, y } = getMousePosition(event.nativeEvent, canvasRef.current);
    drawingManagerRef.current.updateShape(x, y);
    redrawCanvas();
  };

  const handleMouseUp = () => {
    // if (selectedTool === "pencil") {
    //   drawingManagerRef.current.finishPencilDrawing();
    // }
    // setIsDrawing(false);
    // setStartPoint(null);
    if (selectedTool === "pencil") {
      drawingManagerRef.current.finishPencilDrawing();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    drawingManagerRef.current.clear();
    redrawCanvas();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ToolBar
        activeTool={selectedTool}
        setActiveTool={setSelectedTool}
        clearCanvas={clearCanvas}
      />
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
};

export default Canvas;
