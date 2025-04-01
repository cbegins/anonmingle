
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePosts, Post, ReactionType } from "@/hooks/usePosts";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import ReactionButton from "./ReactionButton";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  isNew?: boolean;
}

const PostCard = ({ post, isNew = false }: PostCardProps) => {
  const { isAuthenticated } = useAuth();
  const { votePost, addReaction, getUserVoteAndReaction } = usePosts();
  const { vote: userVote, reaction: userReaction } = getUserVoteAndReaction(post.id);
  const [animateUpvote, setAnimateUpvote] = useState(false);
  const [animateDownvote, setAnimateDownvote] = useState(false);
  const [localPost, setLocalPost] = useState<Post>(post);

  // Update local post when prop changes
  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const handleVote = (voteType: "upvote" | "downvote") => {
    if (!isAuthenticated) return;
    
    const updatedPost = { ...localPost };
    
    // If user already voted the same way, remove the vote
    if (userVote === voteType) {
      if (voteType === "upvote") {
        updatedPost.upvotes -= 1;
        setAnimateUpvote(true);
      } else {
        updatedPost.downvotes -= 1;
        setAnimateDownvote(true);
      }
    }
    // If user voted the opposite way, switch the vote
    else if (userVote) {
      if (voteType === "upvote") {
        updatedPost.upvotes += 1;
        updatedPost.downvotes -= 1;
        setAnimateUpvote(true);
      } else {
        updatedPost.downvotes += 1;
        updatedPost.upvotes -= 1;
        setAnimateDownvote(true);
      }
    }
    // If user hasn't voted yet, add the vote
    else {
      if (voteType === "upvote") {
        updatedPost.upvotes += 1;
        setAnimateUpvote(true);
      } else {
        updatedPost.downvotes += 1;
        setAnimateDownvote(true);
      }
    }
    
    setLocalPost(updatedPost);
    votePost(post.id, voteType);
    
    // Reset animation after a short delay
    setTimeout(() => {
      if (voteType === "upvote") setAnimateUpvote(false);
      else setAnimateDownvote(false);
    }, 400);
  };

  const handleReaction = (reactionType: ReactionType) => {
    if (!isAuthenticated) return;
    
    const updatedPost = { ...localPost };
    const reactions = { ...updatedPost.reactions };
    
    // If user already reacted the same way, remove the reaction
    if (userReaction === reactionType) {
      reactions[reactionType] -= 1;
    }
    // If user reacted differently before, change the reaction
    else if (userReaction) {
      reactions[userReaction] -= 1;
      reactions[reactionType] += 1;
    }
    // If user hasn't reacted yet, add the reaction
    else {
      reactions[reactionType] += 1;
    }
    
    updatedPost.reactions = reactions;
    setLocalPost(updatedPost);
    addReaction(post.id, reactionType);
  };

  // Format the time
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <Card className={`mb-4 overflow-hidden animated-card rounded-xl ${isNew ? 'post-appear' : ''}`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <span className="font-mono text-xs font-medium text-primary">{post.userId.substring(0, 6)}</span>
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-3">
        <p className="whitespace-pre-line">{post.content}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${userVote === "upvote" ? "text-primary bg-primary/10" : ""} ${animateUpvote ? "animate-vote" : ""}`}
            onClick={() => handleVote("upvote")}
            disabled={!isAuthenticated}
          >
            <ThumbsUp size={16} className="mr-1" />
            <span>{localPost.upvotes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${userVote === "downvote" ? "text-destructive bg-destructive/10" : ""} ${animateDownvote ? "animate-vote" : ""}`}
            onClick={() => handleVote("downvote")}
            disabled={!isAuthenticated}
          >
            <ThumbsDown size={16} className="mr-1" />
            <span>{localPost.downvotes}</span>
          </Button>
        </div>
        
        <ReactionButton 
          postId={post.id}
          reactions={localPost.reactions}
          selectedReaction={userReaction}
          onReact={handleReaction}
        />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
