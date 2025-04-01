
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// Define types
interface User {
  id: string;
  bio: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  updateBio: (bio: string) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a mock function to generate random IDs
const generateRandomUserId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("anonUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google auth flow with a loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Create a new user with a random ID
      const newUser = {
        id: generateRandomUserId(),
        bio: null,
      };
      
      // Save user to localStorage
      localStorage.setItem("anonUser", JSON.stringify(newUser));
      
      // Set the user state
      setUser(newUser);
      
      toast({
        title: "Logged in successfully",
        description: `Your anonymous ID: ${newUser.id}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Could not connect to authentication service. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("anonUser");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateBio = (bio: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      bio: bio,
    };
    
    setUser(updatedUser);
    localStorage.setItem("anonUser", JSON.stringify(updatedUser));
    
    toast({
      title: "Bio updated",
      description: "Your bio has been updated successfully.",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateBio,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
