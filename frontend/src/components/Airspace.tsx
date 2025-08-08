import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Users, Wifi } from "lucide-react";

const Airspace = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg text-green-400 cursor-pointer transition-all duration-300">
          <Wifi className="w-4 h-4" />
          <span className="font-semibold text-xs">1</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-card/90 backdrop-blur-xl border-border/50">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Airspace</h4>
            <p className="text-sm text-muted-foreground">
              See who's currently online and what they're up to.
            </p>
            <div className="pt-4">
              <div className="flex items-center pt-2">
                <Users className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  1 user(s) online
                </span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Airspace;
