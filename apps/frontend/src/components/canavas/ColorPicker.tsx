import type React from "react";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  activeColor: string;
  setActiveColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  activeColor,
  setActiveColor,
}) => {
  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ];

  return (
    <div className="absolute top-4 right-4 flex space-x-2">
      {colors.map((color) => (
        <Button
          key={color}
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: color }}
          onClick={() => setActiveColor(color)}
        >
          {color === activeColor && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          )}
        </Button>
      ))}
    </div>
  );
};

export default ColorPicker;
