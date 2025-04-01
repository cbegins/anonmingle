
import { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { SendHorizontal } from "lucide-react";

const MAX_CHARS = 280;

const CreatePost = () => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addPost, cooldownRemaining } = usePosts();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "Please log in to post.",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Empty post",
        description: "Please enter some content for your post.",
      });
      return;
    }
    
    if (content.length > MAX_CHARS) {
      toast({
        variant: "destructive",
        title: "Post too long",
        description: `Post cannot exceed ${MAX_CHARS} characters.`,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addPost(content);
      setContent("");
      textareaRef.current?.focus();
      toast({
        title: "Post created",
        description: "Your post has been published anonymously.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not post",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit post on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <Card className="mb-6 rounded-xl overflow-hidden shadow-md">
      <CardContent className="pt-6">
        <Textarea
          ref={textareaRef}
          placeholder="Share your thoughts anonymously..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="resize-none min-h-[100px] rounded-lg focus:ring-primary/50 transition-shadow"
          disabled={!isAuthenticated || cooldownRemaining > 0}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {cooldownRemaining > 0 ? (
            <span>Cooldown: {cooldownRemaining}s remaining</span>
          ) : (
            <span>{content.length}/{MAX_CHARS}</span>
          )}
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={
            !isAuthenticated || 
            isSubmitting || 
            !content.trim() || 
            content.length > MAX_CHARS || 
            cooldownRemaining > 0
          }
          className="rounded-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Posting...
            </span>
          ) : (
            <span className="flex items-center">
              Post 
              <SendHorizontal size={16} className="ml-2" />
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;
