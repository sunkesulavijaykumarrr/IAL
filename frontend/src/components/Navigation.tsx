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
  LogIn,
  User as UserIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Airspace from "./Airspace";
import Streak from "./Streak";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  syllabusProgress: number;
}

const mottos = [
  "Inspired • Ambitious • Locked",
  "Inquire • Aspire • Lead",
  "Intent • Action • Limitless",
  "I Am Locked"
];

const Navigation = ({ currentView, onViewChange, syllabusProgress }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const mottoInterval = setInterval(() => {
      setCurrentMottoIndex((prevIndex) => (prevIndex + 1) % mottos.length);
    }, 10000);

    return () => clearInterval(mottoInterval);
  }, []);
  
  const handleLogout = async () => {
    try {
        await signOut(auth);
        navigate('/login');
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Your daily command center', badge: null },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen, description: 'Track your preparation progress', badge: `${syllabusProgress}%` },
    { id: 'focus', label: 'Focus Mode', icon: Target, description: 'Deep work sessions', badge: null },
    { id: 'current-affairs', label: 'Current Affairs', icon: Newspaper, description: 'Stay updated with latest news', badge: 'Coming Soon', disabled: true },
    { id: 'community', label: 'Community', icon: Users, description: 'Connect with fellow aspirants', badge: 'Coming Soon', disabled: true },
    { id: 'gamification', label: 'Achievements', icon: Trophy, description: 'Your badges and streaks', badge: 'Level 7', disabled: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart, description: 'Performance insights', badge: null, disabled: true },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Customize your experience', badge: null, disabled: true }
  ];
  
  const mainNavItems = navigationItems.slice(0, 4);
  const moreMenuItems = navigationItems.slice(4);

  const NavButton = ({ item }: { item: typeof navigationItems[0] }) => (
    <Button
      variant={currentView === item.id ? "default" : "ghost"}
      className={`relative flex items-center gap-2 transition-all duration-300 ease-out ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-md'} px-4 py-2 ${currentView === item.id ? 'bg-gradient-to-r from-upsc-primary to-upsc-primary/90 text-white shadow-lg' : 'hover:bg-accent/50'} group animate-slide-in`}
      onClick={() => !item.disabled && onViewChange(item.id)}
      disabled={item.disabled}
    >
      <item.icon className={`w-4 h-4 transition-transform duration-300 ${currentView === item.id ? 'text-white' : 'group-hover:scale-110'}`} />
      <span className="font-medium transition-colors duration-300">{item.label}</span>
      {item.badge && <Badge className={`text-xs ml-1 transition-all duration-300 ${currentView === item.id ? 'bg-white/20 text-white border-white/30' : 'group-hover:scale-105'}`}>{item.badge}</Badge>}
      {currentView === item.id && <div className="absolute inset-0 bg-gradient-to-r from-upsc-primary to-upsc-primary/90 rounded-md -z-10 animate-glow" />}
    </Button>
  );

  const MobileNavItem = ({ item, onClick }: { item: any; onClick?: () => void }) => (
    <Button
      variant={currentView === item.id ? "default" : "ghost"}
      className={`w-full justify-start p-4 transition-all duration-300 ease-out ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-md'} ${currentView === item.id ? 'bg-gradient-to-r from-upsc-primary to-upsc-primary/90 text-white' : 'hover:bg-accent/50'} group animate-fade-in`}
      onClick={onClick}
      disabled={item.disabled}
    >
        <div className="flex items-center space-x-3 w-full">
          <item.icon className={`w-5 h-5 transition-transform duration-300`} />
          <div className="flex-1 text-left">
              <span className="font-medium transition-colors duration-300">{item.label}</span>
              <p className={`text-xs mt-1 transition-colors duration-300 text-muted-foreground`}>{item.description}</p>
          </div>
        </div>
    </Button>
  );
  
  return (
    <>
      <div className="w-full max-w-7xl mx-auto bg-card/80 backdrop-blur-xl border border-border/50 rounded-full transition-all duration-300">
        <div className="flex items-center justify-between h-20 px-4 sm:px-8">
          <div className="flex items-center gap-2 sm:gap-4 animate-slide-in flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
              <img src="/logos/Logo_1.svg" alt="IAL Logo" className="w-full h-full" />
            </div>
            <div className="hidden sm:block w-48 md:w-64">
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">I AM LOCKED</h1>
              <div className="text-xs text-muted-foreground h-4 overflow-hidden relative">
                <AnimatePresence><motion.span key={currentMottoIndex} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }} className="absolute w-full">{mottos[currentMottoIndex]}</motion.span></AnimatePresence>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item, index) => <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}><NavButton item={item} /></div>)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" className="flex items-center gap-2 px-4 py-2 transition-all duration-300 hover:scale-105 hover:bg-accent/50 group"><span className="font-medium">More</span><ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-fade-in border border-border/50 bg-card/90 backdrop-blur-xl">
                  {moreMenuItems.map((item, index) => <DropdownMenuItem key={item.id} onClick={() => !item.disabled && onViewChange(item.id)} disabled={item.disabled} className={`flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] ${currentView === item.id ? 'bg-gradient-to-r from-upsc-primary to-upsc-primary/90 text-white' : 'hover:bg-accent/50'} animate-slide-in`} style={{ animationDelay: `${index * 50}ms` }}><item.icon className={`w-4 h-4 transition-transform duration-300`} /><span>{item.label}</span>{item.badge && <Badge className={`ml-auto text-xs transition-all duration-300 ${currentView === item.id ? 'bg-white/20 text-white border-white/30' : ''}`}>{item.badge}</Badge>}</DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
            <div className="flex items-center gap-3 ml-2">
              <div className="hidden lg:flex items-center gap-3">
                <Streak />
                <Airspace />
              </div>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL ?? undefined} />
                        <AvatarFallback>{user.displayName?.charAt(0) ?? user.email?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName ?? "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link to="/profile"><UserIcon className="mr-2 h-4 w-4" /><span>Profile</span></Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}><LogIn className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login" className="hidden lg:block">
                    <Button variant="outline" className="rounded-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Button>
                </Link>
              )}
            </div>
            <div className="lg:hidden">
              <Button variant="outline" size="icon" className="transition-all duration-300 hover:scale-110 hover:rotate-3" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed right-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-xl overflow-y-auto border-l">
              <div className="p-6 pt-20">
                <div className="space-y-2">
                  {navigationItems.map((item, index) => <div key={item.id} style={{ animationDelay: `${index * 50}ms` }}><MobileNavItem item={item} onClick={() => {onViewChange(item.id); setIsMobileMenuOpen(false);}} /></div>)}
                  <div className="border-t pt-2" style={{ animationDelay: `${navigationItems.length * 50}ms` }}>
                    {user ? (
                        <>
                            <MobileNavItem item={{icon: UserIcon, label: 'Profile', description: 'View your profile'}} onClick={() => {navigate('/profile'); setIsMobileMenuOpen(false);}} />
                            <MobileNavItem item={{icon: LogIn, label: 'Log Out', description: 'Sign out of your account'}} onClick={() => {handleLogout(); setIsMobileMenuOpen(false);}} />
                        </>
                    ) : (
                        <MobileNavItem item={{icon: LogIn, label: 'Login', description: 'Access your account'}} onClick={() => {navigate('/login'); setIsMobileMenuOpen(false);}} />
                    )}
                   </div>
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
