
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Moon, Sun, LogOut, User, Shield } from "lucide-react";
import UserProfile from "./UserProfile";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  useEffect(() => {
    // Check user's preferred color scheme
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);
  
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };
  
  return (
    <>
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="text-primary h-5 w-5" />
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                AnonSocial
              </h1>
            </div>
            {isAuthenticated && (
              <p className="hidden md:block text-sm text-muted-foreground">
                ID: <span className="font-mono">{user?.id}</span>
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            {isAuthenticated && (
              <>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowProfile(true)}
                  className="rounded-full"
                  aria-label="User profile"
                >
                  <User size={18} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={logout}
                  className="rounded-full"
                  aria-label="Log out"
                >
                  <LogOut size={18} />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {isAuthenticated && (
        <UserProfile open={showProfile} onOpenChange={setShowProfile} />
      )}
    </>
  );
};

export default Navbar;
