import Uploadbox from "@/components/uploadbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-[#1e1e1e] ">
      {/* Project Name */}

      {/* */}
      {/* Main Content */}
      <div className="p-12 gap-12 flex flex-col">
        {/* Container*/}
        <div className="w-192 flex flex-col gap-2">
          <h2 className="font-medium">Path</h2>
          <input
            placeholder="C:/Users/Public"
            className="p-4 h-12  bg-[#1b1b1c] border border-[#303439] focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="w-192">
          <Uploadbox />
        </div>
        <div className="w-64 flex flex-col gap-2">
          <Button
            className={cn(
              "rounded-none bg-[#007acc] text-white cursor-pointer",
            )}
          >
            Start Analyzing
          </Button>
        </div>
      </div>
    </div>
  );
}
