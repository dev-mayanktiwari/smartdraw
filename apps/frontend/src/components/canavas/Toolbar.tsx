import React, { useRef } from "react";
import {
  Pencil,
  Move,
  Square,
  Minus,
  Circle,
  Triangle,
  ArrowRight,
  Type,
  ImageIcon,
  Share2,
  Hand,
  CopyX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ShapeType } from "./drawingManager";
import { useState } from "react";
import ShareModal from "./ShareModal";

interface ToolBarProps {
  activeTool: string;
  setActiveTool: (tool: ShapeType) => void;
  onShare?: () => void;
  clearCanvas: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  activeTool,
  setActiveTool,
  onShare,
  clearCanvas,
  onImageUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Hardcoded online users for demo
  const onlineUsers = [
    { id: 1, name: "John D.", image: "https://github.com/shadcn.png" },
    { id: 2, name: "Sarah M.", image: "https://github.com/shadcn.png" },
    { id: 3, name: "Mike R.", image: "https://github.com/shadcn.png" },
    { id: 4, name: "Lisa K.", image: "https://github.com/shadcn.png" },
    { id: 5, name: "Tom W.", image: "https://github.com/shadcn.png" },
  ];

  const displayedUsers = onlineUsers.slice(0, 3);
  const remainingUsers = onlineUsers.length - 3;

  const handleImageClick = () => {
    setActiveTool("image");
    fileInputRef.current?.click();
  };


  return (
    <div className="w-full flex items-center justify-between px-4 py-2 bg-neutral-500 opacity-80 text-white">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.67 3H6.33C4.49 3 3 4.49 3 6.33v11.34C3 19.51 4.49 21 6.33 21h11.34c1.84 0 3.33-1.49 3.33-3.33V6.33C21 4.49 19.51 3 17.67 3zM7.33 19l9.34-9.34v9.34H7.33z"
            fill="currentColor"
          />
        </svg>
        <span className="text-2xl font-bold text-white">SMARTDRAW</span>
      </div>

      {/* Center: Tools */}
      <div className="flex items-center justify-center">
        <div className="flex bg-neutral-800 rounded-lg p-1 gap-1">
          <Button
            variant={activeTool === "hand" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
          >
            <Hand className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "select" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTool("select")}
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "rectangle" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTool("rectangle")}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "ellipse" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTool("ellipse")}
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "triangle" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTool("triangle")}
          >
            <Triangle className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "arrow" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTool("arrow")}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "line" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTool("line")}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "pencil" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTool("pencil")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "text" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTool("text")}
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "image" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={handleImageClick}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          <Button variant="destructive" size="icon" onClick={clearCanvas}>
            <CopyX className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right: Online Users & Share */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          {displayedUsers.map((user, index) => (
            <Avatar
              key={user.id}
              className={cn(
                "w-8 h-8 border-2 border-neutral-900",
                index !== 0 && "-ml-3"
              )}
            >
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          ))}
          {remainingUsers > 0 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 -ml-3 text-sm font-medium border-2 border-neutral-900">
              +{remainingUsers}
            </div>
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          className="hidden sm:flex"
          onClick={() => setIsShareModalOpen(true)}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button
          variant="default"
          size="icon"
          className="sm:hidden"
          onClick={() => setIsShareModalOpen(true)}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ToolBar;
