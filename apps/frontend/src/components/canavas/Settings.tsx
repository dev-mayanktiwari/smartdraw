import { StaticCanvas } from "fabric";
import React, { useEffect, useState } from "react";
import { Object as FabricObject } from "fabric/fabric-impl";
import { Circle } from "fabric/fabric-impl";
import { Rect } from "fabric/fabric-impl";
import { Pattern, Gradient } from "fabric/fabric-impl";

interface FabricObjectWithType extends FabricObject {
  type: string;
}

// Define a type for the fill property
type FabricFill = string | Pattern | Gradient | undefined;

const Settings = ({ canavas }: { canavas: StaticCanvas }) => {
  const [selectedObject, setSelectedObject] =
    useState<FabricObjectWithType | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [color, setColor] = useState<FabricFill>(undefined);

  useEffect(() => {
    if (canavas) {
      canavas.on("selection:created", (event: any) => {
        handleObjectSelection(event.selected[0]);
      });

      canavas.on("selection:updated", (event: any) => {
        handleObjectSelection(event.selected[0]);
      });

      canavas.on("selection:cleared", () => {
        setSelectedObject(null);
        clearSettings();
      });

      canavas.on("object:modified", (event: any) => {
        handleObjectSelection(event.target);
      });

      canavas.on("object:scaling", (event: any) => {
        handleObjectSelection(event.target);
      });
    }
  }, [canavas]);

  const handleObjectSelection = (object: FabricObjectWithType) => {
    if (!object) return;

    if (object.type === "rect") {
      const rect = object as unknown as Rect;
      setWidth(Math.round((rect.width ?? 0) * (rect.scaleX ?? 1)));
      setHeight(Math.round((rect.height ?? 0) * (rect.scaleY ?? 1)));
      setColor(rect.fill ?? undefined);
      setDiameter(0);
    } else if (object.type === "circle") {
      const circle = object as unknown as Circle;
      setDiameter(Math.round((circle.radius ?? 0) * 2 * (circle.scaleX ?? 1)));
      setColor(circle.fill ?? undefined);
      setWidth(0);
      setHeight(0);
    }
  };

  const clearSettings = () => {
    setWidth(0);
    setHeight(0);
    setDiameter(0);
    setColor(undefined);
  };

  return <div>Settings</div>;
};

export default Settings;
