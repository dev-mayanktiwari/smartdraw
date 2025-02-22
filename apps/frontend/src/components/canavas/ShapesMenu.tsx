import type React from "react";
import { Square, Circle, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShapesMenuProps {
  addShape: (shape: string) => void;
}

const ShapesMenu: React.FC<ShapesMenuProps> = ({ addShape }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
     
    </div>
  );
};

export default ShapesMenu;
