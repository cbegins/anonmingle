
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { usePosts } from "@/hooks/usePosts";
import { PostItem } from "@/components/AdminPostList";

const Admin = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { posts, deletePost } = usePosts();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === "Checkmate" && password === "Begins") {
      setIsAuthenticated(true);
      toast.success("Admin login successful");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleDeletePost = (postId: string) => {
    deletePost(postId);
    toast.success("Post deleted successfully");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container max-w-2xl py-6 flex-grow">
        {!isAuthenticated ? (
          <Card className="w-full shadow-lg border-primary/20 animate-fade-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
              <CardDescription>
                Enter your admin credentials to manage posts
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Admin ID</Label>
                  <Input 
                    id="id" 
                    placeholder="Enter your admin ID" 
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Home
                </Button>
                <Button type="submit">
                  Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <Button variant="outline" onClick={handleBack}>
                Back to Home
              </Button>
            </div>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>All Posts</CardTitle>
                <CardDescription>
                  Manage all posts in the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <PostItem 
                        key={post.id} 
                        post={post} 
                        onDelete={handleDeletePost} 
                      />
                    ))
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No posts found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
