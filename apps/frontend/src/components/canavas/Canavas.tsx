"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { RoughCanvas } from "roughjs/bin/canvas";
import { DrawingManager, ShapeType } from "./drawingManager";
import rough from "roughjs";
import { getMousePosition } from "./helper";
import ToolBar from "./Toolbar";
import { CanvasText } from "./shapes";

interface TextInputState {
  isVisible: boolean;
  text: string;
  x: number;
  y: number;
  textElement: CanvasText | null;
}

const Canvas = () => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const roughCanvasRef = useRef<RoughCanvas | null>(null);
  const drawingManagerRef = useRef(new DrawingManager());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLDivElement>(null);

  // States
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ShapeType>("rectangle");
  const [textInput, setTextInput] = useState<TextInputState>({
    isVisible: false,
    text: "",
    x: 0,
    y: 0,
    textElement: null,
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Canvas Drawing and Resizing
  const redrawCanvas = useCallback(() => {
    if (!canvasRef.current || !roughCanvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      const scale = window.devicePixelRatio;
      ctx.save();
      ctx.scale(scale, scale);
      drawingManagerRef.current.drawCanvas(ctx, roughCanvasRef.current);
      ctx.restore();
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const scale = window.devicePixelRatio;

    canvas.width = container.clientWidth * scale;
    canvas.height = container.clientHeight * scale;
    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientHeight}px`;

    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    if (!canvasRef.current) return;
    roughCanvasRef.current = rough.canvas(canvasRef.current);
    resizeCanvas();

    const resizeHandler = () => requestAnimationFrame(resizeCanvas);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [resizeCanvas]);

  // Mouse Event Handlers
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const { x, y } = getMousePosition(event.nativeEvent, canvasRef.current);

    if (selectedTool === "select") {
      const selected = drawingManagerRef.current.selectElementAt(x, y);
      if (selected) {
        setIsDragging(true);
        setDragStart({ x, y });
      }
      redrawCanvas();
      return;
    }

    if (selectedTool === "text") {
      handleTextToolClick(x, y);
      return;
    }

    setIsDrawing(true);
    drawingManagerRef.current.addShape(selectedTool, x, y, x, y);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const { x, y } = getMousePosition(event.nativeEvent, canvasRef.current);

    if (isDragging) {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      drawingManagerRef.current.moveSelectedElement(dx, dy);
      setDragStart({ x, y });
      redrawCanvas();
      return;
    }

    if (isDrawing) {
      drawingManagerRef.current.updateShape(x, y);
      redrawCanvas();
    }
  };

  const handleMouseUp = () => {
    if (selectedTool === "pencil") {
      drawingManagerRef.current.finishPencilDrawing();
    }
    setIsDrawing(false);
    setIsDragging(false);
  };

  // Text Tool Handlers
  const handleTextToolClick = (x: number, y: number) => {
    setTextInput({
      isVisible: true,
      text: "",
      x,
      y,
      textElement: new CanvasText(x, y),
    });
  };

  const handleTextInputClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const commitTextToCanvas = () => {
    if (!textInputRef.current) return;
    const text = textInputRef.current.innerText;
    if (text.trim()) {
      drawingManagerRef.current.addShape(
        "text",
        textInput.x,
        textInput.y,
        0,
        0,
        { content: text }
      );
      redrawCanvas();
    }
    setTextInput({
      isVisible: false,
      text: "",
      x: 0,
      y: 0,
      textElement: null,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      commitTextToCanvas();
    }
  };

  // Image Handler
  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !canvasRef.current) return;

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (!canvasRef.current) return;

          const canvas = canvasRef.current;
          const scale = window.devicePixelRatio;
          const canvasWidth = canvas.width / scale;
          const canvasHeight = canvas.height / scale;

          let width = img.width;
          let height = img.height;

          const maxSize = Math.min(canvasWidth, canvasHeight) * 0.8;
          if (width > maxSize || height > maxSize) {
            const ratio = width / height;
            if (width > height) {
              width = maxSize;
              height = maxSize / ratio;
            } else {
              height = maxSize;
              width = maxSize * ratio;
            }
          }

          const x = (canvasWidth - width) / 2;
          const y = (canvasHeight - height) / 2;

          drawingManagerRef.current.addShape(
            "image",
            x,
            y,
            x + width,
            y + height,
            { image: img }
          );

          redrawCanvas();
        };
        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
      event.target.value = "";
    },
    [redrawCanvas]
  );

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "z":
            if (event.shiftKey) {
              drawingManagerRef.current.redo();
            } else {
              drawingManagerRef.current.undo();
            }
            redrawCanvas();
            event.preventDefault();
            break;
          case "y":
            drawingManagerRef.current.redo();
            redrawCanvas();
            event.preventDefault();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => window.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [redrawCanvas]);

  // Canvas Actions
  const clearCanvas = () => {
    drawingManagerRef.current.clear();
    setTextInput({
      isVisible: false,
      text: "",
      x: 0,
      y: 0,
      textElement: null,
    });
    redrawCanvas();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ToolBar
        activeTool={selectedTool}
        setActiveTool={setSelectedTool}
        clearCanvas={clearCanvas}
        onImageUpload={handleImageUpload}
      />

      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-white"
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {textInput.isVisible && (
          <div
            ref={textInputRef}
            contentEditable
            onKeyDown={handleKeyDown}
            onBlur={commitTextToCanvas}
            onClick={handleTextInputClick}
            className="absolute min-w-[1px] min-h-[1em] outline-none whitespace-pre-wrap break-words"
            style={{
              left: `${textInput.x}px`,
              top: `${textInput.y}px`,
              fontSize: "20px",
              fontFamily: "Arial",
              lineHeight: "1.2",
              padding: "0",
              margin: "0",
              background: "transparent",
            }}
            autoFocus
          />
        )}
      </div>
    </div>
  );
};

export default Canvas;
