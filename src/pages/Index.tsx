
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/hooks/usePosts";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Index = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { posts, isLoading: postsLoading } = usePosts();
  const [newPostIds, setNewPostIds] = useState<Set<string>>(new Set());
  const [prevPosts, setPrevPosts] = useState<string[]>([]);

  // Track new posts
  useEffect(() => {
    if (!postsLoading && posts.length > 0) {
      const currentPostIds = posts.map(post => post.id);
      
      // If this is the first load, just store the current posts
      if (prevPosts.length === 0) {
        setPrevPosts(currentPostIds);
        return;
      }
      
      // Find new posts
      const newIds = currentPostIds.filter(id => !prevPosts.includes(id));
      
      // Mark new posts
      if (newIds.length > 0) {
        setNewPostIds(prev => {
          const updated = new Set(prev);
          newIds.forEach(id => updated.add(id));
          return updated;
        });
        
        // After 3 seconds, remove the "new" status
        setTimeout(() => {
          setNewPostIds(prev => {
            const updated = new Set(prev);
            newIds.forEach(id => updated.delete(id));
            return updated;
          });
        }, 3000);
      }
      
      // Update previous posts record
      setPrevPosts(currentPostIds);
    }
  }, [posts, postsLoading]);

  // Show welcome toast once when component mounts
  useEffect(() => {
    toast("Welcome to AnonSocial", {
      description: "Express yourself freely and anonymously.",
      duration: 5000,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container max-w-2xl py-6 flex-grow">
        {!authLoading && !isAuthenticated ? (
          <AuthModal />
        ) : (
          <>
            <CreatePost />
            
            <div className="space-y-4 mt-6">
              {postsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-xl p-4 space-y-3 animate-pulse-soft">
                    <div className="flex gap-2 items-center">
                      <Skeleton className="h-6 w-20 rounded-lg" />
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </div>
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </div>
                  </div>
                ))
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    isNew={newPostIds.has(post.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12 border rounded-xl bg-accent/20">
                  <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
                  <p className="text-muted-foreground">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      
      <footer className="border-t py-4 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>AnonSocial • Privacy-focused anonymous platform • {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
