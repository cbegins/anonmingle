
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Shield, LockKeyhole, Eye } from "lucide-react";

const AuthModal = () => {
  const { login, isLoading } = useAuth();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm z-50">
      <Card className="w-full max-w-md animate-fade-in shadow-xl border-primary/20">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-2">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome to AnonSocial</CardTitle>
          <CardDescription className="text-center">
            The truly anonymous social platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="space-y-4">
            <div className="bg-accent/50 p-4 rounded-lg flex items-start space-x-3">
              <LockKeyhole className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Privacy First</p>
                <p className="text-xs text-muted-foreground">
                  AnonSocial is a privacy-focused platform where your identity remains completely anonymous.
                </p>
              </div>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Eye className="h-4 w-4 mr-2 text-green-500" />
                <span>No personal information displayed</span>
              </li>
              <li className="flex items-center text-sm">
                <Eye className="h-4 w-4 mr-2 text-green-500" />
                <span>End-to-end encryption</span>
              </li>
              <li className="flex items-center text-sm">
                <Eye className="h-4 w-4 mr-2 text-green-500" />
                <span>Zero data collection</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full"
            onClick={login} 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Signing in...
              </span>
            ) : (
              <span>Sign in anonymously</span>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            By signing in, you agree to our privacy policy and terms of service.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthModal;
