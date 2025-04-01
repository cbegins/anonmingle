
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, Shield } from "lucide-react";
import UserProfile from "./UserProfile";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  
  return (
    <>
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="text-primary h-5 w-5" />
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                AnonSocial
              </h1>
            </Link>
            {isAuthenticated && (
              <p className="hidden md:block text-sm text-muted-foreground">
                ID: <span className="font-mono">{user?.id}</span>
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
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
            
            {isAuthenticated && user?.id === "Checkmate" && (
              <Link to="/admin">
                <Button variant="secondary" size="sm" className="rounded-full">
                  Admin
                </Button>
              </Link>
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
