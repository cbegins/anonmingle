
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { FaGoogle } from "react-icons/fa";

const AuthModal = () => {
  const { login, isLoading } = useAuth();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to AnonSocial</CardTitle>
          <CardDescription className="text-center">
            The truly anonymous social platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-2 text-center">
            <p className="text-sm">
              AnonSocial is a privacy-focused platform where your identity remains completely anonymous.
            </p>
            <ul className="text-sm text-muted-foreground">
              <li>• No personal information displayed</li>
              <li>• End-to-end encryption</li>
              <li>• Zero data collection</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={login} 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <FaGoogle className="mr-2" />
                Sign in with Google
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthModal;
