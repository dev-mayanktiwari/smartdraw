import Canvas from "@/components/canavas/Canavas";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main className="w-full h-screen">
      <Canvas />
      <Toaster />
    </main>
  );
}
