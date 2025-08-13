import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  BookOpen, 
  Target, 
  Newspaper, 
  Users, 
  Trophy, 
  BarChart, 
  Settings,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  Sun,
  Moon,
  Palette,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Airspace from "./Airspace";
import Streak from "./Streak";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  syllabusProgress: number;
  streakCount: number;
}

const mottos = [
  "Inspired • Ambitious • Locked",
  "Inquire • Aspire • Lead",
  "Intent • Action • Limitless",
  "I Am Locked"
];

const Navigation = ({ currentView, onViewChange, syllabusProgress, streakCount }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
  const { setTheme } = useTheme();
  const [user, setUser] = useState({
    displayName: "Arjun Kumar",
    email: "arjun.kumar@example.com",
    photoURL: "https://github.com/shadcn.png",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const mottoInterval = setInterval(() => {
      setCurrentMottoIndex((prevIndex) => (prevIndex + 1) % mottos.length);
    }, 10000);
    return () => clearInterval(mottoInterval);
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Your daily command center', badge: null },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen, description: 'Track your preparation progress', badge: `${syllabusProgress}%` },
    { id: 'focus', label: 'Focus', icon: Target, description: 'Deep work sessions', badge: null },
    { id: 'current-affairs', label: 'Current Affairs', icon: Newspaper, description: 'Stay updated with latest news', badge: 'Coming Soon', disabled: true },
    { id: 'community', label: 'Community', icon: Users, description: 'Connect with fellow aspirants', badge: 'Coming Soon', disabled: true },
    { id: 'gamification', label: 'Achievements', icon: Trophy, description: 'Your badges and streaks', badge: 'Level 7', disabled: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart, description: 'Performance insights', badge: null, disabled: true },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Customize your experience', badge: null, disabled: true }
  ];
  
  const mainNavItems = navigationItems.slice(0, 3);
  const moreMenuItems = navigationItems.slice(3);

  const NavLink = ({ item, isMobile = false, isDropdown = false, showIcon = true }: { item: typeof navigationItems[0], isMobile?: boolean, isDropdown?: boolean, showIcon?: boolean }) => (
    <motion.button
      whileHover={{ y: -2 }}
      className={`w-full justify-start text-left transition-colors duration-200 group ${
        isMobile
        ? `p-4 text-base`
        : isDropdown
        ? `p-3 text-base`
        : `relative flex items-center gap-2 px-3 py-2 text-sm`
      } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${currentView === item.id ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-foreground'}`}
      onClick={() => {
        if (!item.disabled) {
          onViewChange(item.id);
          if (isMobile || isDropdown) setIsMobileMenuOpen(false);
        }
      }}
      disabled={item.disabled}
    >
      <div className={`flex items-center ${isMobile || isDropdown ? 'space-x-4' : 'space-x-2'}`}>
        {showIcon && <item.icon className={`transition-transform duration-300 ${isMobile || isDropdown ? 'w-5 h-5' : `w-4 h-4`}`} />}
        <div className="flex-1 text-left">
          <span className="font-medium">{item.label}</span>
          {(isMobile || isDropdown) && <p className="text-xs mt-1 text-muted-foreground">{item.description}</p>}
        </div>
      </div>
      {!isMobile && !isDropdown && item.badge && <Badge variant="secondary" className={`text-xs ml-1`}>{item.badge}</Badge>}
    </motion.button>
  );
  
  return (
    <>
      <header className="sticky top-2 z-50 w-full px-2">
        <div className="w-full max-w-7xl mx-auto bg-card/80 backdrop-blur-xl border border-border/50 rounded-full transition-all duration-300">
          <div className="flex items-center justify-between h-16 sm:h-20 px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
                <img src="/logos/Logo_1.svg" alt="IAL Logo" className="w-full h-full" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-xl font-bold text-foreground">I AM LOCKED</h1>
                <div className="text-xs text-muted-foreground h-4 overflow-hidden relative w-48">
                  <AnimatePresence>
                    <motion.span key={currentMottoIndex} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }} className="absolute w-full">
                      {mottos[currentMottoIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            <div className="flex-grow flex items-center justify-center">
              <nav className="hidden lg:flex items-center gap-1">
                {mainNavItems.map((item) => <NavLink key={item.id} item={item} showIcon={false} />)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button whileHover={{ y: -2 }} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 group">
                      <span className="font-medium">More</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 animate-fade-in border-border/50 bg-card/90 backdrop-blur-xl p-2 space-y-1">
                    <DropdownMenuLabel className="px-2 py-1.5 text-base font-semibold">More Tools</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {moreMenuItems.map((item) => (
                      <DropdownMenuItem key={item.id} asChild>
                        <NavLink item={item} isDropdown={true} />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
            
            <div className="flex items-center justify-end">
              <div className="hidden lg:flex items-center gap-2 ml-2">
                <Streak streakCount={streakCount} />
                <Airspace />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <Palette className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all monokai:rotate-0 monokai:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("monokai")}>
                      Monokai
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="lg:hidden">
                <Button variant="outline" size="icon" className="transition-all duration-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-s h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
              className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-card/95 backdrop-blur-xl overflow-y-auto border-l"
            >
              <div className="p-4 pt-20">
                <div className="space-y-1">
                  {navigationItems.map((item) => <NavLink key={item.id} item={item} isMobile={true} />)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;