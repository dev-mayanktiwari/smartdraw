"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface StylePanelProps {
  object: FabricObject;
  onUpdate: () => void;
}

const COLORS = [
  "#FFFFFF",
  "#FF9B9B",
  "#4CAF50",
  "#2196F3",
  "#795548",
  "#E0E0E0",
];

const FILLS = ["solid", "pattern", "none"];
const STROKE_WIDTHS = [2, 4, 6];
const STROKE_STYLES = ["solid", "dashed", "dotted"];

const StylePanel: React.FC<StylePanelProps> = ({ object, onUpdate }) => {
  const [strokeColor, setStrokeColor] = useState(object.stroke || "#000000");
  const [fillColor, setFillColor] = useState(object.fill || "transparent");
  const [strokeWidth, setStrokeWidth] = useState(object.strokeWidth || 2);
  const [strokeDashArray, setStrokeDashArray] = useState(
    object.strokeDashArray || null
  );

  useEffect(() => {
    object.set({
      stroke: strokeColor,
      fill: fillColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });
    onUpdate();
  }, [strokeColor, fillColor, strokeWidth, strokeDashArray, object, onUpdate]);

  const handleStrokeStyle = (style: string) => {
    let dashArray = null;
    switch (style) {
      case "dashed":
        dashArray = [10, 5];
        break;
      case "dotted":
        dashArray = [2, 2];
        break;
    }
    setStrokeDashArray(dashArray);
  };

  return (
    <div className="absolute left-4 top-20 w-64 bg-neutral-900 rounded-lg p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-white">Stroke</Label>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((color) => (
            <Button
              key={color}
              variant="outline"
              size="icon"
              className={cn(
                "w-8 h-8 rounded-md",
                strokeColor === color && "ring-2 ring-white"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setStrokeColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Background</Label>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((color) => (
            <Button
              key={color}
              variant="outline"
              size="icon"
              className={cn(
                "w-8 h-8 rounded-md",
                fillColor === color && "ring-2 ring-white"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setFillColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Fill</Label>
        <div className="grid grid-cols-3 gap-2">
          {FILLS.map((fill) => (
            <Button
              key={fill}
              variant="outline"
              className={cn(
                "h-8 rounded-md bg-neutral-800 text-white",
                fillColor === "transparent" &&
                  fill === "none" &&
                  "ring-2 ring-white"
              )}
              onClick={() =>
                setFillColor(fill === "none" ? "transparent" : "#000000")
              }
            >
              {fill}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Stroke width</Label>
        <div className="grid grid-cols-3 gap-2">
          {STROKE_WIDTHS.map((width) => (
            <Button
              key={width}
              variant="outline"
              className={cn(
                "h-8 rounded-md bg-neutral-800 text-white",
                strokeWidth === width && "ring-2 ring-white"
              )}
              onClick={() => setStrokeWidth(width)}
            >
              {width}px
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Stroke style</Label>
        <div className="grid grid-cols-3 gap-2">
          {STROKE_STYLES.map((style) => (
            <Button
              key={style}
              variant="outline"
              className={cn(
                "h-8 rounded-md bg-neutral-800 text-white",
                (style === "solid" && !strokeDashArray) ||
                  (style === "dashed" && strokeDashArray?.[0] === 10) ||
                  (style === "dotted" && strokeDashArray?.[0] === 2)
                  ? "ring-2 ring-white"
                  : ""
              )}
              onClick={() => handleStrokeStyle(style)}
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StylePanel;
